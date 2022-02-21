import React from 'react'
import { useState } from 'react'
import Img13 from '../assets/images/test13.png'
import axios from 'axios'
import { useMoralisFile } from 'react-moralis'
import { useContext } from 'react'
import { NFTContext } from '../contexts/NFTContext'
export default function SwapFace() {
     const {faceByUser, setFaceByUser} = useContext(NFTContext)
     const {
          saveFile,
     } = useMoralisFile();
     const [ipsfFaceUser, setIpsfFaceUser] = useState('')
     const swapFace = async () => {
          const faceUser = await new saveFile("faceUser.png", faceByUser.file, {saveIPFS: true})
          console.log("Face by user",faceUser._ipfs);
          const sendImageToSwap = await axios.post('http://71df-171-252-153-135.ngrok.io', {url: faceUser._ipfs})
		console.log(sendImageToSwap);
          const swapFace = await axios.get('http://localhost:5000/swapFace')
          console.log(swapFace);
          setIpsfFaceUser(swapFace.data.image)
	}

     const handleUserUploadFace = async (e) => {
          const file = e.target.files[0]
          setFaceByUser({
               image: URL.createObjectURL(file),
               file: file
          })
     }
     return (
          <div>
               <input type="file" onChange={handleUserUploadFace}/>
               <div className="d-grid grid-col-3">
                    <img src={Img13} alt="" />
                    <img src={faceByUser.image} alt="" />
                    <img src={ipsfFaceUser} alt="" />
               </div>
               <button onClick={swapFace}>SwapFace</button>
          </div>
     )
}
