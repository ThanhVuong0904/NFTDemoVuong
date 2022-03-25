import React, { useEffect, useState } from 'react'
import { Modal, Button, Form} from 'react-bootstrap'
import { useContext } from 'react'
import { NFTContext } from '../contexts/NFTContext'
import { useRef } from 'react'


export default function ModalFragment({onFrag}) {
     const [amountFrag, setAmountFrag] = useState(0)
     const {
          preparingFragNFTInfo, 
          setPreparingFragNFTInfo, 
          showPreparingFragNFTInfo, 
          setShowPreparingFragNFTInfo
     } = useContext(NFTContext)
     const handleClose = () => {
          setShowPreparingFragNFTInfo(false)
          setPreparingFragNFTInfo({
               tokenId: null,
               image: null,
               arrayImages: null,
          })
     }
     //
     const handleCutImage = async (qtyFrag) => {
          console.log("modal",preparingFragNFTInfo);
          console.log("qtyFrag", qtyFrag);
          var image = new Image()
          image.crossOrigin = "anonymous"
          image.src = preparingFragNFTInfo.image

          var imageResize = []
          if(qtyFrag === '4') {
               console.log("ok");
          }
          var numColsToCut 
          var numRowsToCut
          if(qtyFrag === '4') {
               numColsToCut = 2
               numRowsToCut = 2
          }
          if(qtyFrag === '9') {
               numColsToCut = 3
               numRowsToCut = 3
          }
          if(qtyFrag === '16') {
               numColsToCut = 4
               numRowsToCut = 4
          }
          var widthOfOnePiece = image.naturalWidth / numColsToCut
          var heightOfOnePiece = image.naturalHeight / numRowsToCut
          for(var x = 0; x < numColsToCut; ++x) {
               for(var y = 0; y < numRowsToCut; ++y) {
                    var canvas = document.createElement('canvas');
                    canvas.width = widthOfOnePiece;
                    canvas.height = heightOfOnePiece;
                    var context = canvas.getContext('2d');
                    context.drawImage(
                         image, 
                         y * heightOfOnePiece, 
                         x * widthOfOnePiece, 
                         heightOfOnePiece, 
                         widthOfOnePiece, 
                         0, 
                         0, 
                         canvas.height,
                         canvas.width, 
                    );
                    compressImage(canvas.toDataURL(), image.naturalWidth, image.naturalHeight)
                    .then((compressed) => {
                         return imageResize.push(compressed)
                    })
                    .then(() => setPreparingFragNFTInfo({
                         ...preparingFragNFTInfo,
                         arrayImages: imageResize
                    }))
               }
          }
     }
     function compressImage(src, newX, newY) {
          return new Promise((res, rej) => {
               const img = new Image();
               img.src = src;
               img.onload = () => {
                    const elem = document.createElement("canvas");
                    elem.width = newX;
                    elem.height = newY;
                    const ctx = elem.getContext("2d");
                    ctx.drawImage(img, 0, 0, newX, newY);
                    const data = ctx.canvas.toDataURL();
                    res(data);
               };
               img.onerror = (error) => rej(error);
          });
     }
     const handleSelect = (e) => {
          const select = document.getElementById("selectQty")
          const qtyFrag = select.options[select.selectedIndex].text
          setAmountFrag(qtyFrag)
          handleCutImage(qtyFrag)
     }
     
     useEffect(() => {
          console.log("preparingFragNFTInfo", preparingFragNFTInfo);
     }, [preparingFragNFTInfo])
     const imgRef = useRef()
     return (
          <Modal show={showPreparingFragNFTInfo} onHide={handleClose} size='xl'>
               <Modal.Header closeButton>
                    <Modal.Title>For Frament</Modal.Title>
               </Modal.Header>

               <Modal.Body>
                    <div className='d-flex align-items-center justify-content-between'>
                         <div className='flex-1'>
                              <img 
                                   className='img-preparingFragNFT w100' 
                                   src={preparingFragNFTInfo.image} 
                                   crossOrigin="anonymous" 
                                   ref={imgRef}
                                   alt=""
                              />
                              <p className='text-secondary fw-600 mt-2 mb-2'>Token ID: {preparingFragNFTInfo.tokenId}</p>
                              {/* <p>Kích thước{preparingFragNFTInfo.width}x{preparingFragNFTInfo.height}</p> */}
                              <Form.Group>
                                   <Form.Select 
                                        aria-label="Default select example"
                                        value={amountFrag} 
                                        id="selectQty"
                                        onChange={handleSelect}
                                   >
                                        <option>Vui lòng chọn số lượng phân mảnh</option>
                                        <option value="4">4</option>
                                        <option value="9">9</option>
                                        <option value="16">16</option>
                                   </Form.Select>
                              </Form.Group>
                         </div>
                         <div className={`flex-1 d-grid grid-col-${Math.sqrt(amountFrag)}`}>
                              {preparingFragNFTInfo.arrayImages !== null && (
                                   preparingFragNFTInfo.arrayImages.map((item, index) => {
                                        return <img key={index} src={item} alt={item} className='p-1 w100' />
                                   })
                              )}
                              
                         </div>
                    </div>
                    
               </Modal.Body>
               <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                         Cancel
                    </Button>
                    {/* <Button variant='primary' onClick={onCutImage}>
                         Xem trước
                    </Button> */}
                    <Button 
                         variant='primary' 
                         onClick={onFrag} 
                         disabled={!amountFrag > 0}
                    >
                         Đồng ý Phân mảnh
                    </Button>
               </Modal.Footer>
          </Modal>
     )
}
