import React, { useContext, useEffect, useRef, useState } from 'react'
import {Moralis} from 'moralis'
import { NFTAPI } from '../abiContract'
import { TOKEN_CONTRACT_ADDRESS } from '../constants/address'
import { useMoralisFile } from 'react-moralis'
import { Modal, Button, Form} from 'react-bootstrap'
import { NFTContext } from '../contexts/NFTContext'
import ReactPlayer from 'react-player'
import axios from 'axios'

export default function ModalFragmentVideo() {
     const {
          preparingFragNFTVideoInfo, 
          setPreparingFragNFTVideoInfo, 
          showModalFragmentVideo, 
          setShowModalFragmentVideo,
          web3Api,account
     } = useContext(NFTContext)
     const {
          saveFile,
     } = useMoralisFile();
     const [testMetadata,setTestMetadata] = useState([])
     const [videoBase64Frag, setVideoBase64Frag] = useState([])
     const refDuration = useRef()
     const handleFragVideo = async () => {
          console.log(refDuration.current.getDuration());
          const res = await axios.post('http://localhost:5000/fragmentVideo', 
               {
                    qty: preparingFragNFTVideoInfo.amountFrag, 
                    duration: Math.floor(refDuration.current.getDuration()),
                    link: preparingFragNFTVideoInfo.linkVideo
               }
          )
          console.log({res});
          setVideoBase64Frag(res.data.base64)
     }
     const ok = async () => {
          let arrayMetadata = await Promise.all(testMetadata.map(async (item, index) => {
               const previewFragmentVideo = await new saveFile("previewFragmentVideo.png", item.fileImage, {saveIPFS: true})
               console.log("previewFragmentVideo",previewFragmentVideo._ipfs);

               const videoFrag = new Moralis.File(
                    "videoFrag.mp4", 
                    {
                         base64 : item.base64Video
                    }
               );
               await videoFrag.saveIPFS();
               console.log("videoFrag",videoFrag._ipfs);

               
               const metadata = { 
                    image: previewFragmentVideo._ipfs,
                    animation_url: videoFrag._ipfs,
                    parentTokenId: preparingFragNFTVideoInfo.tokenId,
               };
               const nftFileMetadataFile = new Moralis.File(
                    "metadata.json", 
                    {
                         base64 : btoa(JSON.stringify(metadata))
                    }
               );
               await nftFileMetadataFile.saveIPFS();
               const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
               return nftFileMetadataFilePath
          }))
          console.log({arrayMetadata});
          const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
          const receipt = await contract.methods.createCollection(arrayMetadata, preparingFragNFTVideoInfo.tokenId).send({from: account})
          console.log(`receipt`,receipt);
     }
     useEffect(() => {
          console.log(videoBase64Frag);
          console.log(testMetadata);
     }, [testMetadata, videoBase64Frag])
     return (
          <Modal show={showModalFragmentVideo} size='xl'>
               <Modal.Header closeButton>
                    <Modal.Title>For Frament Video</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                    
                    <div className="d-grid grid-col-2 grid-gap-10">
                         <div>
                              <ReactPlayer 
                                   controls={true} 
                                   url={preparingFragNFTVideoInfo.linkVideo} 
                                   ref={refDuration}
                                   width='60%%' 
                                   height='60%%'
                              />
                              <p>Token ID{preparingFragNFTVideoInfo.tokenId}</p>
                              <label htmlFor="" className='mt-3 mb-3'>Nhập số lượng phân mảnh</label>
                              <input 
                                   type="text" 
                                   value = {preparingFragNFTVideoInfo.amountFrag}
                                   onChange={(e) => 
                                        setPreparingFragNFTVideoInfo({
                                             ...preparingFragNFTVideoInfo, 
                                             amountFrag: e.target.value
                                        })
                                   }
                              />
                         </div>
                         <div 
                              className={`d-grid grid-col-${Math.sqrt(preparingFragNFTVideoInfo.amountFrag)}`}
                              style={{gridGap: 40}}
                         >
                              {
                                   videoBase64Frag.map((item, index) => {
                                        return (
                                             <div key={index}>
                                                  <ReactPlayer 
                                                       controls={true} 
                                                       url={`data:video/mp4;base64,${item}`} 
                                                       width='100%' 
                                                       height='100%'
                                                  />
                                                  <input 
                                                       type="file" 
                                                       onChange={(e) => setTestMetadata([...testMetadata, {
                                                            index,
                                                            fileImage: e.target.files[0],
                                                            base64Video: item
                                                       }])}
                                                  />
                                             </div>
                                        )
                                   })
                              }
                         </div>
                    </div>
                    <Button onClick={handleFragVideo}>Xem trước</Button>
                    <Button onClick={ok}>Phân mảnh</Button>
               </Modal.Body>
          </Modal>
     )
}
