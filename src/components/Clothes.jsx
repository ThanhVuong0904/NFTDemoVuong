import React, {useContext} from 'react'
import CheckIcon from '../assets/images/bx-check.svg'
import { NFTContext } from '../contexts/NFTContext'

export default function Clothes() {
     const {options, CLOTHES, clothes, setClothes, result, setResult} = useContext(NFTContext)
     const handleClothes = (id) => {
          setClothes(id)
          setResult({...result, clothes: id})
     }
     
     return (
          <div className={`d-grid-col-3 content-list clothes ${options === 5   ? 'active' : ''}`}>
               {
                    CLOTHES.map(item => {
                         return (
                              <div 
                                   className="content-item" 
                                   key={item.image}
                                   onClick={() => handleClothes(item.id)}
                              >
                                   <img src={item.image} alt="" />
                                   {item.id === clothes 
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
