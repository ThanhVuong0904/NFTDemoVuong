import React, { useState, useContext, useRef} from 'react'
import { NFTContext } from '../contexts/NFTContext'
// import { contractABI } from '../abi'
import { NFTAPI } from '../abiContract'
import { TOKEN_CONTRACT_ADDRESS } from '../constants/address'
import {Moralis} from 'moralis'
import { useMoralisFile } from 'react-moralis'
import axios from 'axios'


export default function PreviewAvata() {
     const {
          saveFile,
     } = useMoralisFile();
     //Id bây giờ không quan trọng, chỉ dùng để đặt tên cho hình
     
     const [rotate, setRotate] = useState(0)
     const refRorate = useRef(null)
     const {
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
                    }
               }
          }
          else if(mouthByUser.boolean && !backgroundByUser.boolean) {
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
                    }
               }
          }
     }

     const handleRemoveBg = async () => {
          const mouthFileImage = await new saveFile("mouth.png", mouthByUser.file, {saveIPFS: true})
          console.log("mouth by user",mouthFileImage._ipfs);

          const removeBg = await axios.post('http://localhost:5000/removeBackground', {mouthByUser: mouthFileImage._ipfs})
          console.log(removeBg);
          if(removeBg.data.success) {
               setMouthByUser({
                    ...mouthByUser,
                    image: removeBg.data.image,
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
               <p>Xoay hình</p> 
               <input type="range" value={rotate} onChange={handleRotate} min={-360} max={360}/>
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
               <button onClick={handleRemoveBg} className='create-nft-button'>Xóa phông</button>
               <button onClick={createNFT} className='create-nft-button'>Create NFT</button>
          </div>
     )
}
