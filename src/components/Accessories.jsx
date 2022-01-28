import React, {useContext} from 'react'
import CheckIcon from '../assets/images/bx-check.svg'
import { NFTContext } from '../contexts/NFTContext'

export default function Accessories() {
     const {options, ACCESSORIES, accessories, setAccessories, result, setResult} = useContext(NFTContext)
     const handleAccessories = (id) => {
          setResult({...result, accessories: id})
          setAccessories(id)
     }
     return (
          <div className={`d-grid-col-3 content-list accessories ${options === 6   ? 'active' : ''}`}>
               {
                    ACCESSORIES.map(item => {
                         return (
                              <div 
                                   className="content-item" 
                                   key={item.image}
                                   onClick={() => handleAccessories(item.id)}
                              >
                                   <img src={item.image} alt="" />
                                   {item.id === accessories 
                                   ? 
                                   <div className="check-icon">
                                        <img src={CheckIcon} alt="" />
                                   </div>
                                   : ''
                                   }
                              </div>
                         )
                    })
               }
          </div>
     )
}
