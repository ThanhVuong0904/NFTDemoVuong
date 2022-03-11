import React, { useState, useContext, useRef} from 'react'
import { NFTContext } from '../contexts/NFTContext'
import ReactPlayer from 'react-player'
// import { contractABI } from '../abi'
import { NFTAPI } from '../abiContract'
import { TOKEN_CONTRACT_ADDRESS } from '../constants/address'
import {Moralis} from 'moralis'
import { useMoralisFile } from 'react-moralis'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

export default function PreviewAvata() {
     const {
          saveFile,
     } = useMoralisFile();
     //Id bây giờ không quan trọng, chỉ dùng để đặt tên cho hình
     
     const [rotate, setRotate] = useState(0)
     const refRorate = useRef(null)
     const {
          options,
          cloudInaryVideo, setCloudInaraVideo,
          blobLinkVideo, setBlobLinkVideo,
          previewImageForVideo, setPreviewImageForVideo,
          EYES, eye, 
          HEADDRESS, headdress, 
          PHONE, phone, 
          MOUTH, mouth, 
          CLOTHES, clothes, 
          ACCESSORIES, accessories,
          BACKGROUND, background,
          backgroundByUser,
          phoneByUser,
          mouthByUser, setMouthByUser,
          result, web3Api, account
     } = useContext(NFTContext)
     const createNFT = async () => {
          const id = toast.loading("Đang tạo NFT.....")
          if(backgroundByUser.boolean && !mouthByUser.boolean) {
               //Upload background to IPFS
               const backgroundFileImage = await new saveFile("background.png", backgroundByUser.file, {saveIPFS: true})
               console.log("Background by user",backgroundFileImage._ipfs);
               //Composite Image
               const composite = await axios.post('http://localhost:5000/composite', 
                    {result: result , backgroundByUser: backgroundFileImage._ipfs}
               )
               console.log("composite background",composite);
               if(composite.data.success) {
                    //Upload image composite to IPFS
                    const res = await axios.post('http://localhost:5000/uploadImage')
                    console.log("Upload image composite to IFPS",res);
                    //Create Metadata
                    if(res.data.success) {
                         const metadata = { 
                              image: res.data.image,
                              parentTokenId: 0,
                         };
                         const nftFileMetadataFile = new Moralis.File(
                              "metadata.json", 
                              {
                                   base64 : btoa(JSON.stringify(metadata))
                              }
                         );
                         await nftFileMetadataFile.saveIPFS();
                         const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
                         console.log("metadata",nftFileMetadataFilePath);
                         const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
                         const receipt = await contract.methods.createNFT(nftFileMetadataFilePath, 0).send({from: account})
                         console.log("receipt",receipt);
                         if(receipt.status) {
                              toast.update(id, { render: "Tạo NFT thành công", type: "success", isLoading: false, autoClose: 5000});
                         }
                    }
               }
          }
          else if(mouthByUser.boolean && !backgroundByUser.boolean) {
               let linkImage
               if(mouthByUser.isRemoveBg) {
                    linkImage = mouthByUser.image
                    console.log("mouth by user",linkImage);
               }
               else {
                    const mouthFileImage = await new saveFile("mouth.png", mouthByUser.file, {saveIPFS: true})
                    linkImage = mouthFileImage._ipfs
                    console.log("mouth by user",linkImage);
               }
               const removeBg = await axios.post('http://localhost:5000/removeBackground', {mouthByUser: linkImage})
               console.log(removeBg);
               if(removeBg.data.success) {
                    setMouthByUser({
                         ...mouthByUser,
                         image: removeBg.data.image,
                    })
                    const handleMouthImage = await axios.post(
                         'http://localhost:5000/handleMouthImage', 
                         {rotate, mouthImage: removeBg.data.image}
                    )
                    console.log("handleMouthImage",handleMouthImage);
                    if(handleMouthImage.data.success) {
                         const composite = await axios.post('http://localhost:5000/composite', 
                              {result: result , mouthByUser: true}
                         )
                         console.log("composite mouth",composite);
                         if(composite.data.success) {
                              const res = await axios.post('http://localhost:5000/uploadImage')
                              console.log(res);
                              if(res.data.success) {
                                   const metadata = { 
                                        image: res.data.image,
                                        parentTokenId: 0,
                                   };
                                   const nftFileMetadataFile = new Moralis.File(
                                        "metadata.json", 
                                        {
                                             base64 : btoa(JSON.stringify(metadata))
                                        }
                                   );
                                   await nftFileMetadataFile.saveIPFS();
                                   const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
                                   console.log("metadata",nftFileMetadataFilePath);
                                   const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
                                   const receipt = await contract.methods.createNFT(nftFileMetadataFilePath,0).send({from: account})
                                   console.log("receipt",receipt);
                                   if(receipt.status) {
                                        toast.update(id, { render: "Tạo NFT thành công", type: "success", isLoading: false, autoClose: 5000});
                                   }
                              }
                         }
                    }
               }  
          }
          else if(backgroundByUser.boolean && mouthByUser.boolean) {
               const backgroundFileImage = await new saveFile("background.png", backgroundByUser.file, {saveIPFS: true})
               console.log("Background by user",backgroundFileImage._ipfs);

               const mouthFileImage = await new saveFile("mouth.png", mouthByUser.file, {saveIPFS: true})
               console.log("mouth by user",mouthFileImage._ipfs);
               const removeBg = await axios.post('http://localhost:5000/removeBackground', {mouthByUser: mouthFileImage._ipfs})
               console.log(removeBg);
               if(removeBg.data.success) {
                    setMouthByUser({
                         ...mouthByUser,
                         image: removeBg.data.image,
                    })
                    const handleMouthImage = await axios.post(
                         'http://localhost:5000/handleMouthImage', 
                         {rotate, mouthImage: removeBg.data.image}
                    )
                    console.log("handleMouthImage",handleMouthImage);
                    if(handleMouthImage.data.success) {
                         const composite = await axios.post('http://localhost:5000/composite', 
                              {result: result , mouthByUser: true, backgroundByUser: backgroundFileImage._ipfs}
                         )
                         console.log("composite background mouth",composite);
                         if(composite.data.success) {
                              const res = await axios.post('http://localhost:5000/uploadImage')
                              console.log(res);
                              if(res.data.success) {
                                   const metadata = { 
                                        image: res.data.image,
                                        parentTokenId: 0,
                                   };
                                   const nftFileMetadataFile = new Moralis.File(
                                        "metadata.json", 
                                        {
                                             base64 : btoa(JSON.stringify(metadata))
                                        }
                                   );
                                   await nftFileMetadataFile.saveIPFS();
                                   const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
                                   console.log("metadata",nftFileMetadataFilePath);
                                   const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
                                   const receipt = await contract.methods.createNFT(nftFileMetadataFilePath,0).send({from: account})
                                   console.log("receipt",receipt);
                                   if(receipt.status) {
                                        toast.update(id, { render: "Tạo NFT thành công", type: "success", isLoading: false, autoClose: 5000});
                                   }
                              }
                         }
                    }
               }  

          }
          else {
               const composite = await axios.post('http://localhost:5000/composite', 
                    {result: result}
               )
               console.log("composite basic",composite);
               if(composite.data.success) {
                    const res = await axios.post('http://localhost:5000/uploadImage')
                    console.log("upload image",res);
                    if(res.data.success) {
                         const metadata = { 
                              image: res.data.image,
                              parentTokenId: 0,
                         };
                         const nftFileMetadataFile = new Moralis.File(
                              "metadata.json", 
                              {
                                   base64 : btoa(JSON.stringify(metadata))
                              }
                         );
                         await nftFileMetadataFile.saveIPFS();
                         const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
                         console.log("metadata",nftFileMetadataFilePath);
                         const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
                         const receipt = await contract.methods.createNFT(nftFileMetadataFilePath,0).send({from: account})
                         console.log("receipt",receipt);
                         if(receipt.status) {
                              toast.update(id, { render: "Tạo NFT thành công", type: "success", isLoading: false, autoClose: 5000});
                         }
                    }
               }
          }
     }
     
     const createNFTVideo = async () => {
          let formData = new FormData()
          formData.append('file', cloudInaryVideo.file)
          formData.append('upload_preset', "m3ghszb7")
          const res = await axios.post('https://api.cloudinary.com/v1_1/dcahbrrcb/video/upload', formData ,{
               headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
               }
          })
          console.log({res});
          setCloudInaraVideo({
               ...cloudInaryVideo,
               link: res.data.url
          })
          const previewImage = await new saveFile("previewImage.png", previewImageForVideo.file, {saveIPFS: true})
          console.log("PreviewImage",previewImage._ipfs);
          if(res.data) {
               const metadata = { 
                    image: previewImage._ipfs,
                    animation_url: res.data.url,
                    parentTokenId: 0,
               };
               const nftFileMetadataFile = new Moralis.File(
                    "metadata.json", 
                    {
                         base64 : btoa(JSON.stringify(metadata))
                    }
               );
               await nftFileMetadataFile.saveIPFS();
               const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
               console.log("metadata",nftFileMetadataFilePath);
               const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
               const receipt = await contract.methods.createNFT(nftFileMetadataFilePath, 0).send({from: account})
               console.log("receipt",receipt);
          }
     }

     const handleRemoveBg = async () => {
          const id = toast.loading("Đang xóa phông.....")
          //do something else
          const mouthFileImage = await new saveFile("mouth.png", mouthByUser.file, {saveIPFS: true})
          console.log("mouth by user",mouthFileImage._ipfs)
          const removeBg = await axios.post('http://localhost:5000/removeBackground', {mouthByUser: mouthFileImage._ipfs})
          console.log(removeBg);
          if(removeBg.data.success) {
               toast.update(id, { render: "Xóa phông thành công", type: "success", isLoading: false, autoClose: 5000});
               setMouthByUser({
                    ...mouthByUser,
                    image: removeBg.data.image,
                    isRemoveBg: true
               })
          }
     }
     const handleRotate = (e) => {
          setRotate(e.target.value)
          console.log("Xoay",e.target.value);
          refRorate.current.style.transform = `rotate(${e.target.value}deg)`
     }
     
     return (
          <div className="preview-avatar">
               <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    />
                    {/* Same as */}
               <ToastContainer />
               {mouthByUser.boolean && 
                    <>
                    <p>Xoay hình</p>
                    <input type="range" value={rotate} onChange={handleRotate} min={-360} max={360}/>
                    </>
               }
               {
                    options === 8 ?
                    <div className='wrap-video'>
                         <ReactPlayer 
                              url={blobLinkVideo} 
                              width="100%" 
                              height="100%" 
                              controls={true}
                         />
                    </div>
                    : 
                    <div className="preview-main">
                         <h3>Metaverse Ape</h3>
                         <div className="preview-content">
                              {EYES.map(item => item.id === eye 
                                   ?
                                   <div key={item.image} className='preview-image z-index2'>
                                        <img src={item.image} alt="" />
                                   </div> 
                                   : '')
                              }
                              {HEADDRESS.map(item => item.id === headdress 
                                   ?
                                   <div key={item.image} className='preview-image z-index2'>
                                        <img src={item.image} alt="" />
                                   </div> 
                                   : '')
                              }
                              {
                                   phoneByUser.boolean 
                                   ? <img src={phoneByUser.image} alt="" /> 
                                   :
                                   PHONE.map(item => item.id === phone 
                                   ?
                                   <div key={item.image} className='preview-image z-index2'>
                                        <img src={item.image} alt="" />
                                   </div> 
                                   : '')
                              }
                              {
                                   mouthByUser.boolean 
                                   ? 
                                   <div className='preview-image z-index2'>
                                        <img className='mouth-user' src={mouthByUser.image} alt="" ref={refRorate}/> 
                                   </div> 
                                   :
                                   MOUTH.map(item => item.id === mouth 
                                   ?
                                   <div key={item.image} className='preview-image z-index2'>
                                        <img src={item.image} alt="" />
                                   </div> 
                                   : '')
                              }
                              {CLOTHES.map(item => item.id === clothes 
                                   ?
                                   <div key={item.image} className='preview-image z-index2'>
                                        <img src={item.image} alt="" />
                                   </div> 
                                   : '')
                              }
                              {ACCESSORIES.map(item => item.id === accessories 
                                   ?
                                   <div key={item.image} className='preview-image z-index2'>
                                        <img src={item.image} alt="" />
                                   </div> 
                                   : '')
                              }
                              {
                                   backgroundByUser.boolean 
                                   ? <img src={backgroundByUser.image} alt="" /> 
                                   :
                                   BACKGROUND.map(item => item.id === background 
                                        ?
                                        <div key={item.image} className='preview-image'>
                                             <img src={item.image} alt="" />
                                        </div> 
                                        : ''
                                   )
                                   
                              }
                              
                         </div>
                    </div>
               } 
               
               {mouthByUser.boolean && <button onClick={handleRemoveBg} className='create-nft-button btn btn-primary'>Xóa phông</button>}
               {options !== 8 && <button onClick={createNFT} className='create-nft-button btn btn-primary'>Create NFT</button>}
               {options == 8 && <button onClick={createNFTVideo} className='create-nft-button btn btn-primary'>Create NFT Video</button>}
          </div>
     )
}
