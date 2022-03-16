import { createContext, useEffect, useState } from 'react'
import { NFTAPI } from '../abiContract';
import { TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS_BSC } from '../constants/address';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { useMoralis } from "react-moralis";
import { NFTAPI_BSC } from '../abiBsc';
export const NFTContext = createContext()

const NFTContextProvider = ({children}) => {
     const { 
		authenticate, isAuthenticated, user, isInitialized, web3,
          account, logout, isWeb3Enabled, enableWeb3, isAuthenticating, isUnauthenticated
	} = useMoralis();
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
     
     const [showModalFragmentVideo, setShowModalFragmentVideo] = useState(false)
     const [preparingFragNFTVideoInfo, setPreparingFragNFTVideoInfo] = useState({
          tokenId: null,
          linkVideo: null,
          amountFrag: '',
          duration: ''
     })

     const [itemForSale, setItemForSale] = useState({
          tokenId: null,
          image: null,
          price: 0,
          chain: ''
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
     const [blobLinkVideo, setBlobLinkVideo] = useState('')
     const [cloudInaryVideo, setCloudInaraVideo] = useState({
          file: null,
          link: null
     })
     const [durationVideo, setDurationVideo] = useState(0)
     const [previewImageForVideo, setPreviewImageForVideo] = useState({
          file: null,
          image: null
     })
     
     
     useEffect(() => {
          const loadProvider = async () => {
               const provider = await detectEthereumProvider()
               if(provider) {
                    setWeb3Api({
                         web3: new Web3(provider),
                         provider,
                         chain: provider.networkVersion,
                    })
               }
               else {
                    console.error("please, Install Metamask")
               }
          }
          loadProvider()
     }, [])
     const createNFTRinkeby = async (nftFileMetadataFilePath, parentTokenId) => {
          const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
          const receipt = await contract.methods.createNFT(nftFileMetadataFilePath, parentTokenId).send({from: account})
          console.log("receipt rinkeby",receipt);
     }
     const createNFTBsc = async (nftFileMetadataFilePath, parentTokenId) => {
          const contract = await new web3Api.web3.eth.Contract(NFTAPI_BSC, TOKEN_CONTRACT_ADDRESS_BSC)
          const receipt = await contract.methods.createNFT(nftFileMetadataFilePath, parentTokenId).send({from: account})
          console.log("receipt bsc",receipt);
     }
     const checkNetWork = async (chain, hex) => {
          if(web3Api.provider.networkVersion !== chain) {
               // alert('vui lòng đổi mạng')
               await web3Api.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: hex}],
               });
          }
     }
     const state = {
          checkNetWork,
          blobLinkVideo, setBlobLinkVideo,
          cloudInaryVideo, setCloudInaraVideo,
          durationVideo, setDurationVideo,
          previewImageForVideo, setPreviewImageForVideo,
          showModalFragmentVideo, setShowModalFragmentVideo,
          preparingFragNFTVideoInfo, setPreparingFragNFTVideoInfo,
          authenticate, isAuthenticated, user,isInitialized, isAuthenticating, isUnauthenticated,
          web3Api , account , logout, isWeb3Enabled, enableWeb3,
          faceByUser, setFaceByUser,
          showForSale, setShowForSale,
          itemForSale, setItemForSale,
          preparingFragNFTInfo, setPreparingFragNFTInfo,
          showPreparingFragNFTInfo, setShowPreparingFragNFTInfo,
          dstImage, setDstImage, 
          srcImage, setSrcImage,
          createNFTRinkeby,
          createNFTBsc, web3
     }
     
     
     return (
          <NFTContext.Provider value={state}>
               {children}
          </NFTContext.Provider>
     )
}
export default NFTContextProvider