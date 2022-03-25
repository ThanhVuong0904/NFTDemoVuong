import React, { useContext } from 'react'
import { AvatartNFTContext } from '../contexts/AvatarNFTContext'

const OPTIONS = [
     {id: 1, display: 'Eyes (6)'},
     {id: 2, display: 'Headdress (5)'},
     {id: 3, display: 'Phone (6)'},
     {id: 4, display: 'Mouth (5)'},
     {id: 5, display: 'Clothes (7)'},
     {id: 6, display: 'Accessories (6)'},
     {id: 7, display: 'Background (7)'},
     {id: 8, display: 'Video'},
     {id: 9, display: 'Upload Image'},
]
export default function Options() {
     const {options, setOptions} = useContext(AvatartNFTContext)
     return (
          <div className="options">
               <h3>Synthesize</h3>
               {
                    OPTIONS.map(item => 
                         <button 
                              key={item.id} 
                              className={`btn option-item ${item.id === options ? 'active' : ''}`}
                              onClick={() => setOptions(item.id)}
                         >
                              {item.display}
                         </button>
                    )
               }
               
          </div>
     )
}
