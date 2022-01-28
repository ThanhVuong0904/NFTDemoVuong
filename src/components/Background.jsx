import React, {useContext} from 'react'
import CheckIcon from '../assets/images/bx-check.svg'
import { NFTContext } from '../contexts/NFTContext'

export default function Background() {
     const {
          options, 
          BACKGROUND, background, setBackground, 
          backgroundByUser, setBackgroundByUser,
          result, setResult
     } = useContext(NFTContext)
     const handleBackGround = (id) => {
          setBackground(id)
          setResult({...result, background: id})
          setBackgroundByUser({boolean: false, image: null, file: null})
     }
     const handleBackgroundByUser = (e) => {
          const file = e.target.files[0]
          setBackgroundByUser({
               boolean: true, 
               image: URL.createObjectURL(file),
               file: file,
          })
     }
     return (
          <div className={`d-grid-col-3 content-list background ${options === 7   ? 'active' : ''}`}>
               <input type="file" onChange={handleBackgroundByUser}/>
               {
                    BACKGROUND.map(item => {
                         return (
                              <div 
                                   className="content-item" 
                                   key={item.image}
                                   onClick={() => handleBackGround(item.id)}
                              >
                                   <img src={item.image} alt="" />
                                   {item.id === background 
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
