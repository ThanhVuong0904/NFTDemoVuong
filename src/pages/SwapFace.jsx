import React from 'react'
import { useState } from 'react'
import Img13 from '../assets/images/test13.png'
import axios from 'axios'
import { useMoralisFile } from 'react-moralis'
import { useContext } from 'react'
import { NFTContext } from '../contexts/NFTContext'
export default function SwapFace() {
     const {faceByUser, setFaceByUser, srcImage, setSrcImage, dstImage, setDstImage} = useContext(NFTContext)
     const {
          saveFile,
     } = useMoralisFile();
     const [swapFaceIPFS, setSwapFaceIPFS] = useState('')
     
     const swapFace = async () => {
          const srcIPFS = await new saveFile("srcImage.png", srcImage.file, {saveIPFS: true})
          console.log("src by user",srcIPFS._ipfs);

          const dstIPFS = await new saveFile("dstImage.png", dstImage.file, {saveIPFS: true})
          console.log("dst by user",dstIPFS._ipfs);

          const sendImageToSwap = await axios.post('http://e362-171-252-188-153.ngrok.io', 
               {url_src: srcIPFS._ipfs, url_dst: dstIPFS._ipfs}
          )
          // let t1 = 'https://ipfs.moralis.io:2053/ipfs/QmZvZKVU7xM2NW46mvCMPPSLxKe6VE7FbWQidkyquuicnC'
          // let t2 = 'https://ipfs.moralis.io:2053/ipfs/QmSzYpRbAYr52QCek7cfqEvTEa8Pnas63xVHqtBcTdX6Vw'
          // const sendImageToSwap = await axios.post('http://127.0.0.1:7777', 
          //      {url_src: t1, url_dst: t2}
          // )
		console.log(sendImageToSwap);
          setSwapFaceIPFS(sendImageToSwap.data.image_url)
	}

     const handleSrcImageUpload = async (e) => {
          const file = e.target.files[0]
          setSrcImage({
               image: URL.createObjectURL(file),
               file: file
          })
     }
     const handleDstImageUpload = async (e) => {
          const file = e.target.files[0]
          setDstImage({
               image: URL.createObjectURL(file),
               file: file
          })
     }
     return (
          <div>
               <input type="file" onChange={handleSrcImageUpload}/>
               <input type="file" onChange={handleDstImageUpload}/>
               <div className="d-grid grid-col-3">
                    <img src={srcImage.image} alt="" />
                    <img src={dstImage.image} alt="" />
                    <img src={swapFaceIPFS} alt="" />
               </div>
               <button onClick={swapFace}>SwapFace</button>
          </div>
     )
}
