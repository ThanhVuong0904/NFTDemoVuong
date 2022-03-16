import React, {useContext} from 'react'
import CheckIcon from '../assets/images/bx-check.svg'
import { AvatartNFTContext } from '../contexts/AvatarNFTContext'
import { NFTContext } from '../contexts/NFTContext'

export default function Headdress() {
     const {options, HEADDRESS, headdress, setHeaddress, result, setResult} = useContext(AvatartNFTContext)
     const handleHeaddress = (id) => {
          setHeaddress(id)
          setResult({...result, headdress: id})
     }
     return (
          <div className={`d-grid-col-3 content-list headdress ${options === 2   ? 'active' : ''}`}>
               {
                    HEADDRESS.map(item => {
                         return (
                              <div 
                                   className="content-item" 
                                   key={item.image}
                                   onClick={() => handleHeaddress(item.id)}
                              >
                                   <img src={item.image} alt="" />
                                   {item.id === headdress 
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
