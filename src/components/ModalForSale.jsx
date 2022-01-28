import React, { useContext, useState} from 'react'
import { Modal, Button, Form} from 'react-bootstrap'
import { NFTContext } from '../contexts/NFTContext'
export default function ModalForSale({onBuyNFT}) {
     const {showForSale, setShowForSale, askingPrice, setAskingPrice, itemForSale} = useContext(NFTContext)
     const handleClose = () => {
          setShowForSale(false)
     }
     return (
          <Modal show={showForSale} onHide={handleClose}>
               <Modal.Header closeButton>
                    <Modal.Title>For Sale</Modal.Title>
               </Modal.Header>
               <Form>
                    <Modal.Body>
                         <div>
                              <img src={itemForSale.image} alt="" />
                              <p>{itemForSale.tokenId}</p>
                         </div>
                         <Form.Group>
                              <Form.Label>ETH</Form.Label>
                              <Form.Control 
                                   type="number" 
                                   name='price'
                                   value={askingPrice} 
                                   onChange={(e) => setAskingPrice(e.target.value)}
                              />
                         </Form.Group>
                    </Modal.Body>
               </Form>
               <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                         Cancel
                    </Button>
                    <Button variant='primary' type='submit' onClick={onBuyNFT}>
                         Rao bán
                    </Button>
               </Modal.Footer>
          </Modal>
     )
}
