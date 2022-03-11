import React from 'react'
import Options from '../components/Options'
import Eyes from '../components/Eyes'
import Headdress from '../components/Headdress'
import Phone from '../components/Phone'
import Mouth from '../components/Mouth'
import Clothes from '../components/Clothes'
import Accessories from '../components/Accessories'
import Background from '../components/Background'
import PreviewAvata from '../components/PreviewAvata'
import NFTVideo from '../components/NFTVideo'
export default function CreateNFT() {
     return (
          <div className='create-nft'>
               <Options />
               <div className="content">
                    <Eyes />
                    <Headdress />
                    <Phone />
                    <Mouth />
                    <Clothes/>
                    <Accessories/>
                    <Background />
                    <NFTVideo />
               </div>
               <PreviewAvata />
          </div>
     )
}
