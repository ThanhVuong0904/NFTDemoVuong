import React from 'react'
import { Modal, Button, Form} from 'react-bootstrap'
import { useContext } from 'react'
import { NFTContext } from '../contexts/NFTContext'
import { useRef } from 'react'


export default function ModalFragment({onCutImage, onFrag}) {
     const {
          preparingFragNFTInfo, 
          setPreparingFragNFTInfo, 
          showPreparingFragNFTInfo, 
          setShowPreparingFragNFTInfo
     } = useContext(NFTContext)
     const handleClose = () => {
          setShowPreparingFragNFTInfo(false)
     }
     const handleSelect = (e) => {
          const select = document.getElementById("selectQty")
          const qtyFrag = select.options[select.selectedIndex].text
          setPreparingFragNFTInfo(
               {
                    ...preparingFragNFTInfo, 
                    qtyFrag
               }
          )
          console.log(preparingFragNFTInfo);
     }
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
                              />
                              <p>{preparingFragNFTInfo.tokenId}</p>
                              {/* <p>Kích thước{preparingFragNFTInfo.width}x{preparingFragNFTInfo.height}</p> */}
                              <Form.Group>
                                   <Form.Select 
                                        aria-label="Default select example"
                                        value={preparingFragNFTInfo.qtyFrag} 
                                        id="selectQty"
                                        onChange={handleSelect}
                                   >
                                        <option>Open this select menu</option>
                                        <option value="4">4</option>
                                        <option value="9">9</option>
                                        <option value="16">16</option>
                                   </Form.Select>
                              </Form.Group>
                         </div>
                         <div className={`flex-1 d-grid grid-col-${Math.sqrt(preparingFragNFTInfo.qtyFrag)}`}>
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
                    <Button variant='primary' onClick={onCutImage}>
                         Xem trước
                    </Button>
                    <Button 
                         variant='primary' 
                         onClick={onFrag} 
                         // disabled={!preparingFragNFTInfo.arrayImages.length > 0}
                    >
                         Đồng ý Phân mảnh
                    </Button>
               </Modal.Footer>
          </Modal>
     )
}
