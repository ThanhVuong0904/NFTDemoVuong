import React, {useContext} from 'react'
import { AvatartNFTContext } from '../contexts/AvatarNFTContext'

export default function NFTImageUser() {
     const {options, setImageByUser} = useContext(AvatartNFTContext)
     const handleChangeImage = (e) => {
          const file = e.target.files[0]
          setImageByUser({
               boolean: true,
               file,
               image: URL.createObjectURL(file)
          })
     }
     return (
          <div className={`d-grid-col-3 content-list image-by-user ${options === 9  ? 'active' : ''}`}>
               <div>
                    <label htmlFor="">Chọn hình</label>
                    <input type="file" onChange={handleChangeImage}/>
               </div>
          </div>
     )
}
