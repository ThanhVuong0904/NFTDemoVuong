import React, { useRef } from 'react'
import { useState } from 'react'
import Img13 from '../assets/images/test13.png'
import axios from 'axios'
import { useMoralisFile } from 'react-moralis'
import { useContext } from 'react'
import { NFTContext } from '../contexts/NFTContext'
import ReactPlayer from 'react-player'
export default function SwapFace() {
     const {faceByUser, setFaceByUser, srcImage, setSrcImage, dstImage, setDstImage, isAuthenticated} = useContext(NFTContext)
     const {
          saveFile,
     } = useMoralisFile();
     const [swapFaceIPFS, setSwapFaceIPFS] = useState('')
     const [video, setVideo] = useState()
     const [linkVideo, setLinkVideo] = useState('')
     const [durationVideo,setDurationVideo] = useState('')
     const [qtyFragment, setQtyFragment] = useState(0)
     function getBase64(file) {
          return new Promise((resolve, reject) => {
               const reader = new FileReader();
               reader.readAsDataURL(file);
               reader.onload = () => {
                    let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
                    if ((encoded.length % 4) > 0) {
                         encoded += '='.repeat(4 - (encoded.length % 4));
                    }
                    resolve(encoded);
               };
               reader.onerror = error => reject(error);
          });
     }
     const swapFace = async () => {
          console.log({isAuthenticated});
          console.log(srcImage);
          console.log(dstImage);
          const sendImageToSwap = await axios.post('https://swapapi-v3.herokuapp.com/', 
               {base64_src: srcImage.base64, base64_dst: dstImage.base64}
          )
          
		console.log(sendImageToSwap);
          setSwapFaceIPFS(sendImageToSwap.data.image_url)
	}

     const handleSrcImageUpload = async (e) => {
          const file = e.target.files[0]
          setSrcImage({
               image: URL.createObjectURL(file),
               base64: await getBase64(file)
          })
          
     }
     const handleDstImageUpload = async (e) => {
          const file = e.target.files[0]
          setDstImage({
               image: URL.createObjectURL(file),
               base64: await getBase64(file)
          })
     }
     
     // const test = async () => {
     //      const res = await axios.post('http://localhost:5000/uploadvideo', 
     //      {qty: 4, duration: 10, timeEachVideo: 10/4}
     //      )
     // }
     return (
          <div>
               <label htmlFor="">Chọn hình src</label>
               <input type="file" onChange={handleSrcImageUpload}/>
               <label htmlFor="">Chọn hình dst</label>
               <input type="file" onChange={handleDstImageUpload}/>
               <div className="d-grid grid-col-3">
                    <img src={srcImage.image} alt="" />
                    <img src={dstImage.image} alt="" />
                    <img src={swapFaceIPFS} alt="" />
               </div>
               <button onClick={swapFace}>SwapFace</button>
               {/* <button onClick={test} className='btn btn-primary'>Phân mảnh video</button> */}
               
          </div>
     )
}
