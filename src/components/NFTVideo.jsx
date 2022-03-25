import React, {useContext, useState} from 'react'
import {Moralis} from'moralis';
import { NFTContext } from '../contexts/NFTContext'
import axios from 'axios';
import { AvatartNFTContext } from '../contexts/AvatarNFTContext';

export default function NFTVideo() {
     const REGEX_URL = '^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$'
     const {
          cloudInaryVideo, setCloudInaraVideo,
          youtubeUrl, setYoutubeUrl,
          blobLinkVideo, setBlobLinkVideo,
          durationVideo, setDurationVideo,
          fromComputer, setFromComputer,
          previewImageForVideo, setPreviewImageForVideo
     } = useContext(NFTContext)

     const {
          options,
     } = useContext(AvatartNFTContext)
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
     const handleChangeMethod = (e) => {
          console.log("Change");
          setFromComputer(!fromComputer)
     }
     return (
          <div className={`content-list video ${options === 8 ? 'active' : ''}`}>
               <select name="" id="" onChange={handleChangeMethod}>
                    <option value="">From Computer</option>
                    <option value="">From Youtube</option>
               </select>
               {
                    fromComputer ? <>
                         <label htmlFor="">Chọn video</label>
                         <input type="file" placeholder='Upload' onChange={handleChangeVideo}/>
                    </>
               : <input type="text" placeholder='Link video youtube' onChange={(e) => setYoutubeUrl(e.target.value)}/>
               }
               <label htmlFor="">Chọn Preview Image</label>
               <input type="file" onChange={handleChangePreviewImageForVideo}/>

               <img src={previewImageForVideo.image} alt="" />
          </div>
     )
}
