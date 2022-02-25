import { createContext, useEffect, useState } from 'react'
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { useMoralis } from "react-moralis";
import Eye1 from '../assets/images/eyes/Eyes Closed1.png'
import Eye2 from '../assets/images/eyes/Eyes Normal1.png'
import Eye3 from '../assets/images/eyes/Eyes Sleepy1.png'
import Eye4 from '../assets/images/eyes/Eyes Tears1.png'
import Eye5 from '../assets/images/eyes/Eyes Tears2.png'
import Eye6 from '../assets/images/eyes/Eyes Tears3.png'
import Headdress1 from '../assets/images/headdress/Hair-1.png'
import Headdress2 from '../assets/images/headdress/Hair-2.png'
import Headdress3 from '../assets/images/headdress/Hair-3.png'
import Headdress4 from '../assets/images/headdress/Hair-4.png'
import Headdress5 from '../assets/images/headdress/Hair-5.png'
import Phone1 from '../assets/images/phone/Phone-1.png'
import Phone2 from '../assets/images/phone/Phone-2.png'
import Phone3 from '../assets/images/phone/Phone-3.png'
import Phone4 from '../assets/images/phone/Phone-4.png'
import Phone5 from '../assets/images/phone/Phone-5.png'
import Phone6 from '../assets/images/phone/Phone-6.png'
import Mouth1 from '../assets/images/mouth/Mouth-1.png'
import Mouth2 from '../assets/images/mouth/Mouth-2.png'
import Mouth3 from '../assets/images/mouth/Mouth-3.png'
import Mouth4 from '../assets/images/mouth/Mouth-4.png'
import Mouth5 from '../assets/images/mouth/Mouth-5.png'
import Clothe1 from '../assets/images/clothes/0default.png'
import Clothe2 from '../assets/images/clothes/Cloth-1.png'
import Clothe3 from '../assets/images/clothes/Cloth-2.png'
import Clothe4 from '../assets/images/clothes/Cloth-3.png'
import Clothe5 from '../assets/images/clothes/Cloth-4.png'
import Clothe6 from '../assets/images/clothes/Cloth-5.png'
import Clothe7 from '../assets/images/clothes/Cloth-6.png'
import Accessories1 from '../assets/images/accessories/0default.png'
import Accessories2 from '../assets/images/accessories/Accessories-1.png'
import Accessories3 from '../assets/images/accessories/Accessories-2.png'
import Accessories4 from '../assets/images/accessories/Accessories-3.png'
import Accessories5 from '../assets/images/accessories/Accessories-4.png'
import Accessories6 from '../assets/images/accessories/Accessories-5.png'
import Accessories7 from '../assets/images/accessories/Accessories-6.png'
import Background1 from '../assets/images/background/0default.png'
import Background2 from '../assets/images/background/BG-stuff-1.jpg'
import Background3 from '../assets/images/background/BG-stuff-2.jpg'
import Background4 from '../assets/images/background/BG-stuff-3.jpg'
import Background5 from '../assets/images/background/BG-stuff-4.jpg'
import Background6 from '../assets/images/background/BG-stuff-5.jpg'
import Background7 from '../assets/images/background/BG-stuff-6.jpg'
export const NFTContext = createContext()

const NFTContextProvider = ({children}) => {
     const [web3Api, setWeb3Api] = useState({
          provider: null,
          web3: null,
     })
     const [showForSale, setShowForSale] = useState(false)
     const [showPreparingFragNFTInfo, setShowPreparingFragNFTInfo] = useState(false)

     const [preparingFragNFTInfo, setPreparingFragNFTInfo] = useState({
          tokenId: null,
          image: null,
          arrayImages: null,
     })
     
     const [itemForSale, setItemForSale] = useState({
          tokenId: null,
          image: null,
          price: 0
     })
     const [backgroundByUser, setBackgroundByUser] = useState({
          boolean: false,
          image: null,
          file: null,
     })
     const [faceByUser, setFaceByUser] = useState({
          boolean: false,
          image: null,
          file: null,
     })
     
     const [srcImage, setSrcImage] = useState({
          image: null,
          base64: null,
     })
     const [dstImage, setDstImage] = useState({
          image: null,
          base64: null,
     })
     const [phoneByUser, setPhoneByUser] = useState({
          boolean: false,
          image: null,
          file: null,
     })
     const [mouthByUser, setMouthByUser] = useState({
          boolean: false,
          image: null,
          file: null,
     })
     const { 
		authenticate, isAuthenticated, user, isInitialized,
          account, logout, isWeb3Enabled, enableWeb3, isAuthenticating, isUnauthenticated
	} = useMoralis();
     //Eye, Headdress...
     const [options, setOptions] = useState(1)
     //Eye
     const EYES = [
          {id: 1, image: Eye1},
          {id: 2, image: Eye2},
          {id: 3, image: Eye3},
          {id: 4, image: Eye4},
          {id: 5, image: Eye5},
          {id: 6, image: Eye6},
     ]
     const [eye, setEye] = useState(1)
     //HEADDRESS
     const HEADDRESS = [
          {id:1, image: Headdress1},
          {id:2, image: Headdress2},
          {id:3, image: Headdress3},
          {id:4, image: Headdress4},
          {id:5, image: Headdress5},
     ]
     const [headdress, setHeaddress] = useState(1)

     //PHONE
     const PHONE = [
          {id:1, image: Phone1},
          {id:2, image: Phone2},
          {id:3, image: Phone3},
          {id:4, image: Phone4},
          {id:5, image: Phone5},
          {id:6, image: Phone6},
     ]
     const [phone, setPhone] = useState(1)

     //MOUTH
     const MOUTH = [
          {id:1, image: Mouth1},
          {id:2, image: Mouth2},
          {id:3, image: Mouth3},
          {id:4, image: Mouth4},
          {id:5, image: Mouth5},
     ]
     const [mouth, setMouth] = useState(1)
     //CLOTHES
     const CLOTHES = [
          {id:1, image: Clothe1},
          {id:2, image: Clothe2},
          {id:3, image: Clothe3},
          {id:4, image: Clothe4},
          {id:5, image: Clothe5},
          {id:6, image: Clothe6},
          {id:7, image: Clothe7},
     ]
     const [clothes, setClothes] = useState(1)

     //Accessories
     const ACCESSORIES = [
          {id:1, image: Accessories1},
          {id:2, image: Accessories2},
          {id:3, image: Accessories3},
          {id:4, image: Accessories4},
          {id:5, image: Accessories5},
          {id:6, image: Accessories6},
          {id:7, image: Accessories7},
     ]
     const [accessories, setAccessories] = useState(1)
     //Background
     const BACKGROUND = [
          {id:1, image: Background1},
          {id:2, image: Background2},
          {id:3, image: Background3},
          {id:4, image: Background4},
          {id:5, image: Background5},
          {id:6, image: Background6},
          {id:7, image: Background7},
     ]
     const [background, setBackground] = useState(1)
     const [result, setResult] = useState({
          eye,
          headdress,
          phone,
          mouth,
          clothes,
          accessories,
          background
     })
     
     useEffect(() => {
          const loadProvider = async () => {
               const provider = await detectEthereumProvider()
               if(provider) {
                    setWeb3Api({
                         web3: new Web3(provider),
                         provider,
                    })
               }
               else {
                    console.error("please, Install Metamask")
               }
          }
          loadProvider()
     }, [])

     const state = {
          options, setOptions,
          EYES, eye, setEye,
          HEADDRESS, headdress, setHeaddress,
          PHONE, phone, setPhone,
          MOUTH, mouth, setMouth,
          CLOTHES, clothes, setClothes,
          ACCESSORIES, accessories, setAccessories,
          BACKGROUND, background, setBackground,
          backgroundByUser, setBackgroundByUser,
          result, setResult,
          authenticate, isAuthenticated, user,isInitialized, isAuthenticating, isUnauthenticated,
          web3Api , account , logout, isWeb3Enabled, enableWeb3,
          phoneByUser, setPhoneByUser,
          mouthByUser, setMouthByUser,
          faceByUser, setFaceByUser,
          showForSale, setShowForSale,
          itemForSale, setItemForSale,
          preparingFragNFTInfo, setPreparingFragNFTInfo,
          showPreparingFragNFTInfo, setShowPreparingFragNFTInfo,
          dstImage, setDstImage, 
          srcImage, setSrcImage
     }
     
     
     return (
          <NFTContext.Provider value={state}>
               {children}
          </NFTContext.Provider>
     )
}
export default NFTContextProvider