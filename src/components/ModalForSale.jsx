import React, { useContext } from 'react'
import { Modal, Button, Form} from 'react-bootstrap'
import { NFTContext } from '../contexts/NFTContext'
export default function ModalForSale({onBuyNFT}) {
     const {showForSale, setShowForSale,setItemForSale, itemForSale} = useContext(NFTContext)
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
                              <p>{itemForSale.chain}</p>
                         </div>
                         <Form.Group>
                              <Form.Label>ETH</Form.Label>
                              <Form.Control 
                                   type="number" 
                                   name='price'
                                   value={itemForSale.price} 
                                   onChange={(e) => setItemForSale({...itemForSale, price: e.target.value})}
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
