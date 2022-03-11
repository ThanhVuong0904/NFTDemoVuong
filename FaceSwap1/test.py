'''
Author: Naiyuan liu
Github: https://github.com/NNNNAI
Date: 2021-11-23 17:03:58
LastEditors: Naiyuan liu
LastEditTime: 2021-11-24 19:19:43
Description: 
'''

import cv2
import torch
import fractions
import numpy as np
from PIL import Image
import torch.nn.functional as F
from torchvision import transforms
from models.models import create_model
from options.test_options import TestOptions
from insightface_func.face_detect_crop_single import Face_detect_crop
from util.reverse2original import reverse2wholeimage
import os
from util.add_watermark import watermark_image
from util.norm import SpecificNorm
from parsing_model.model import BiSeNet
from flask import *
from flask_cors import CORS, cross_origin
from flask_ngrok import run_with_ngrok
import requests
import base64
import json

APP = Flask(__name__)
run_with_ngrok(APP)
CORS(APP)

@APP.route('/abc', methods=['POST'])
def alo():
  print('base', request.json['base64_src'])
  data_set = {'Success': 'True', 'Message': 'SwapFace in python'}
  json_dump = json.dumps(data_set)
  return json_dump

@APP.route('/', methods=['POST'])
def hello():
  
  def lcm(a, b): return abs(a * b) / fractions.gcd(a, b) if a and b else 0

  transformer_Arcface = transforms.Compose([
          transforms.ToTensor(),
          transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
      ])

  def _totensor(array):
    tensor = torch.from_numpy(array)
    img = tensor.transpose(0, 1).transpose(0, 2).contiguous()
    return img.float().div(255)

  opt = TestOptions().parse()

  start_epoch, epoch_iter = 1, 0
  crop_size = opt.crop_size

  torch.nn.Module.dump_patches = True
  if crop_size == 512:
      opt.which_epoch = 550000
      opt.name = '512'
      mode = 'ffhq'
  else:
      mode = 'None'
  logoclass = watermark_image('./simswaplogo/simswaplogo.png')
  model = create_model(opt)
  model.eval()

  spNorm =SpecificNorm()
  app = Face_detect_crop(name='antelope', root='./insightface_func/models')
  app.prepare(ctx_id= 0, det_thresh=0.6, det_size=(640,640),mode=mode)

  with torch.no_grad():
      # pic_a = opt.pic_a_path
      base64_src = request.json['base64_src']
      
      decode_base64_img_src = base64.b64decode(base64_src); 
      npimg_src = np.fromstring(decode_base64_img_src, dtype=np.uint8); 
      decode_src = cv2.imdecode(npimg_src, 1)

      base64_dst = request.json['base64_dst']
      
      decode_base64_img_dst = base64.b64decode(base64_dst); 
      npimg_dst = np.fromstring(decode_base64_img_dst, dtype=np.uint8); 
      decode_dst = cv2.imdecode(npimg_dst, 1)

      img_a_whole = decode_src
      img_a_align_crop, _ = app.get(img_a_whole,crop_size)
      img_a_align_crop_pil = Image.fromarray(cv2.cvtColor(img_a_align_crop[0],cv2.COLOR_BGR2RGB)) 
      img_a = transformer_Arcface(img_a_align_crop_pil)
      img_id = img_a.view(-1, img_a.shape[0], img_a.shape[1], img_a.shape[2])

      # convert numpy to tensor
      img_id = img_id.cuda()

      #create latent id
      img_id_downsample = F.interpolate(img_id, size=(112,112))
      latend_id = model.netArc(img_id_downsample)
      latend_id = F.normalize(latend_id, p=2, dim=1)


      ############## Forward Pass ######################

      # pic_b = opt.pic_b_path
      img_b_whole = decode_dst

      img_b_align_crop_list, b_mat_list = app.get(img_b_whole,crop_size)
      # detect_results = None
      swap_result_list = []

      b_align_crop_tenor_list = []

      for b_align_crop in img_b_align_crop_list:

          b_align_crop_tenor = _totensor(cv2.cvtColor(b_align_crop,cv2.COLOR_BGR2RGB))[None,...].cuda()

          swap_result = model(None, b_align_crop_tenor, latend_id, None, True)[0]
          swap_result_list.append(swap_result)
          b_align_crop_tenor_list.append(b_align_crop_tenor)

      if opt.use_mask:
          n_classes = 19
          net = BiSeNet(n_classes=n_classes)
          net.cuda()
          save_pth = os.path.join('./parsing_model/checkpoint', '79999_iter.pth')
          net.load_state_dict(torch.load(save_pth))
          net.eval()
      else:
          net =None

      reverse2wholeimage(b_align_crop_tenor_list, swap_result_list, b_mat_list, crop_size, img_b_whole, logoclass, \
          os.path.join(opt.output_path, 'result_whole_swapsingle.jpg'), opt.no_simswaplogo,pasring_model =net,use_mask=opt.use_mask, norm = spNorm)

      print(' ')

      print('************ Done ! ************')
          # upload image swap to ipfs
  with open("output/result_whole_swapsingle.jpg", "rb") as image2string:
      converted_string = base64.b64encode(image2string.read())

    # converted_string trả về base64 nhưng có kí tự b'
    # phải decode mới mất chữ b'
  s = converted_string.decode('utf-8')
  dataIPFS = [{
      'path': 'images/output.jpg',
      'content': f'{s}'
  }]
  headers2 = {
      'X-API-KEY': 'k30Du9VUUJbgHG6db8QItgxGryCNwcw0KhZ1tfZz86e1LlabB44y1sMwEwqprYPr',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  }

  x = requests.post('https://deep-index.moralis.io/api/v2/ipfs/uploadFolder', json = dataIPFS, headers=headers2)
  y = json.dumps(x.json()[0])
  resp = json.loads(y)
  data_set = {'Success': 'True', 'Message': 'SwapFace in python', 'image_url' : f'{resp["path"]}'}
  json_dump = json.dumps(data_set)
  return json_dump

if __name__ == '__main__':
    APP.run()
