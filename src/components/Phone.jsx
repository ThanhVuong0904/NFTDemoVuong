import React, { useContext } from 'react'
import { NFTContext } from '../contexts/NFTContext'
import CheckIcon from '../assets/images/bx-check.svg'
import { AvatartNFTContext } from '../contexts/AvatarNFTContext'
export default function Phone() {
     const {options, PHONE, phone, setPhone, result, setResult, phoneByUser, setPhoneByUser} = useContext(AvatartNFTContext)
     const handlePhone = (id) => {
          setPhone(id)
          setResult({...result, phone: id})
          setPhoneByUser({boolean: false, image: null, file: null})
     }
     const handlePhoneByUser = (e) => {
          const file = e.target.files[0]
          setPhoneByUser({
               boolean: true, 
               image: URL.createObjectURL(file),
               file: file,
          })
     }
     return (
          <div className={`d-grid-col-3 content-list phone ${options === 3   ? 'active' : ''}`}>
               <input type="file" onChange={handlePhoneByUser}/>
               {
                    PHONE.map(item => {
                         return (
                              <div 
                                   className="content-item" 
                                   key={item.image}
                                   onClick={() => handlePhone(item.id)}
                              >
                                   <img src={item.image} alt="" />
                                   {item.id === phone 
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
