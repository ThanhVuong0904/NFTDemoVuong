import React, { useContext } from 'react'
import { NFTContext } from '../contexts/NFTContext'
import CheckIcon from '../assets/images/bx-check.svg'


export default function Mouth() {
     const {options, MOUTH, mouth, setMouth, result, setResult, mouthByUser, setMouthByUser} = useContext(NFTContext)
     const handleMouth = (id) => {
          setMouth(id)
          setResult({...result, mouth: id})
          setMouthByUser({boolean: false, image: null, file: null})
     }
     const handleMouthByUser = (e) => {
          const file = e.target.files[0]
          setMouthByUser({
               boolean: true, 
               image: URL.createObjectURL(file),
               file: file,
          })
     }
     return (
          <div className={`d-grid-col-3 content-list mouth ${options === 4   ? 'active' : ''}`}>
               <input type="file" onChange={handleMouthByUser}/>
               {
                    MOUTH.map(item => {
                         return (
                              <div 
                                   className="content-item" 
                                   key={item.image}
                                   onClick={() => handleMouth(item.id)}
                              >
                                   <img src={item.image} alt="" />
                                   {item.id === mouth 
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
