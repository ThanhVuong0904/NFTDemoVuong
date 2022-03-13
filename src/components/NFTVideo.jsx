import React, {useContext} from 'react'
import { NFTContext } from '../contexts/NFTContext'
import axios from 'axios';

export default function NFTVideo() {
     const {
          options,
          cloudInaryVideo, setCloudInaraVideo,
          blobLinkVideo, setBlobLinkVideo,
          durationVideo, setDurationVideo,
          previewImageForVideo, setPreviewImageForVideo
     } = useContext(NFTContext)
     console.log(options);
     const handleChangeVideo = async e => {
          const file = e.target.files[0]
          const fileUrl = URL.createObjectURL(file)
          setCloudInaraVideo({
               ...cloudInaryVideo,
               file
          })
          setBlobLinkVideo(fileUrl)
          var vid = document.createElement('video');
          vid.src = fileUrl;

          vid.ondurationchange = function() {
               console.log(this.duration);
               console.log(vid.duration);
               setDurationVideo(this.duration)
          };
     }
     const handleChangePreviewImageForVideo = (e) => {
          const file = e.target.files[0]
          setPreviewImageForVideo({
               image: URL.createObjectURL(file),
               file
          })
     }
     return (
          <div className={`content-list video ${options === 8 ? 'active' : ''}`}>
               <label htmlFor="">Chọn video</label>
               <input type="file" onChange={handleChangeVideo}/>
               <label htmlFor="">Chọn Preview Image</label>
               <input type="file" onChange={handleChangePreviewImageForVideo}/>

               <img src={previewImageForVideo.image} alt="" />
          </div>
     )
}
