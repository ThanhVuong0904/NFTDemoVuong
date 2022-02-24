#! /usr/bin/env python
import os
import urllib.request
import cv2
import argparse
from flask import *
from flask_cors import CORS, cross_origin
from face_detection import select_face
from face_swap import face_swap
import numpy as np
from requests.auth import HTTPBasicAuth
import requests
import base64
from msilib import type_key
import json

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def request_pages():
    data_set = {'Success': 'True', 'Message': 'g'}
    json_dump = json.dumps(data_set)
    return json_dump

def stringToBase64(s):
    return base64.b64encode(s.encode('utf-8'))

@app.route('/', methods=['POST'])
def request_page():
    
    parser = argparse.ArgumentParser(description='FaceSwapApp')
    # parser.add_argument('--src',  default='imgs/test13.png', help='Path for source image')
    # parser.add_argument('--dst',  default='imgs/test14.png', help='Path for target image')
    # parser.add_argument('--out',  default='results/output6_7.jpg', help='Path for storing output images')
    parser.add_argument('--warp_2d', default=False, action='store_true', help='2d or 3d warp')
    parser.add_argument('--correct_color', default=False, action='store_true', help='Correct color')
    parser.add_argument('--no_debug_window', default=False, action='store_true', help='Don\'t show debug window')
    args = parser.parse_args()
    
    user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
    headers={'User-Agent':user_agent} 

    url_src = request.json['url_src']
    request_src = urllib.request.Request(url_src,None,headers) #The assembled request
    response_src = urllib.request.urlopen(request_src)
    decode_src = cv2.imdecode(np.array(bytearray(response_src.read()), dtype=np.uint8), -1)

    url_dst = request.json['url_dst']
    request_dst = urllib.request.Request(url_dst,None,headers) #The assembled request
    response_dst = urllib.request.urlopen(request_dst)
    decode_dst = cv2.imdecode(np.array(bytearray(response_dst.read()), dtype=np.uint8), -1)

    print('url', url_src)
    print('request', url_dst)
    # Read images
    src_img = decode_src
    dst_img = decode_dst


    # Select src face
    src_points, src_shape, src_face = select_face(src_img)
    # Select dst face
    dst_points, dst_shape, dst_face = select_face(dst_img)

    if src_points is None or dst_points is None:
        print('Detect 0 Face !!!')
        exit(-1)

    output = face_swap(src_face, dst_face, src_points, dst_points, dst_shape, dst_img, args)

    dir_path = os.path.dirname('results/output6_7.jpg')
    if not os.path.isdir(dir_path):
        os.makedirs(dir_path)

    cv2.imwrite('results/output6_7.jpg', output)

    # upload image swap to ipfs
    with open("results/output6_7.jpg", "rb") as image2string:
        converted_string = base64.b64encode(image2string.read())

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

    #
    ##For debug
    # if not args.no_debug_window:
    #     cv2.imshow("From", dst_img)
    #     cv2.imshow("To", output)
    #     cv2.waitKey(0)
        
    #     cv2.destroyAllWindows()
    
    data_set = {'Success': 'True', 'Message': 'SwapFace in python', 'image_url' : f'{resp["path"]}'}
    json_dump = json.dumps(data_set)
    return json_dump

if __name__ == '__main__':
    app.run(port=7777)
    

    