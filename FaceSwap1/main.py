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

app = Flask(__name__)
CORS(app)

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

    url = request.json['url']
    user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
    headers={'User-Agent':user_agent} 
    r1 = urllib.request.Request(url,None,headers) #The assembled request
    response = urllib.request.urlopen(r1)
    img = cv2.imdecode(np.array(bytearray(response.read()), dtype=np.uint8), -1)

    print('url', url)
    # Read images
    src_img = cv2.imread('imgs/test13.png')
    dst_img = img


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
    cv2.imwrite('../src/userupload/output6_7.jpg', output)

    ##For debug
    # if not args.no_debug_window:
    #     cv2.imshow("From", dst_img)
    #     cv2.imshow("To", output)
    #     cv2.waitKey(0)
        
    #     cv2.destroyAllWindows()
    
    data_set = {'Success': 'True', 'Message': 'SwapFace'}
    json_dump = json.dumps(data_set)
    return json_dump

if __name__ == '__main__':
    app.run(port=7777)
    

    