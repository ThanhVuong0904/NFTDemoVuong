import React, { useEffect, useContext, useState, useRef} from 'react'
import ReactPlayer from 'react-player';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import {Moralis} from 'moralis'
import { useMoralisFile } from 'react-moralis'
import { NFTContext } from '../contexts/NFTContext'
import {MarketplaceABI} from '../abiMarket'
import { NFTAPI } from '../abiContract'
import { TOKEN_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS_BSC, MARKET_CONTRACT_ADDRESS_BSC } from '../constants/address'
import ETHIcon from '../assets/images/eth_logo.svg'
import PlayIcon from '../assets/images/bx-play.svg'
import ModalForSale from '../components/ModalForSale'
import DotIcon from '../assets/images/bx-dots-horizontal-rounded.svg'
import ModalFragment from '../components/ModalFragment'
import ModalFragmentVideo from '../components/ModalFragmentVideo';
import BNBIcon from '../assets/images/bnb_logo.png'

export default function MyNFT() {
     const { 
		account, web3Api,
          setShowForSale,
          itemForSale, setItemForSale,
          preparingFragNFTInfo, setPreparingFragNFTInfo,
          setShowPreparingFragNFTInfo,
          preparingFragNFTVideoInfo, setPreparingFragNFTVideoInfo,
          showModalFragmentVideo, setShowModalFragmentVideo, web3,
          checkNetWork
	} = useContext(NFTContext);

     const {
          saveFile,
     } = useMoralisFile();
     const [myNFT, setMyNFT] = useState([])
     const imgRef = useRef()
     const [isShowMoreOptions, setIsShowMoreOptions] = useState({
          index: null,
          bool: false
     })

     const [playVideo, setPlayVideo] = useState(null)
     const getUserNFTs = async () => {
          const ownerRinkeby = await Moralis.Cloud.run('getUserNFTs', {
               account_address: account,
               token_address: TOKEN_CONTRACT_ADDRESS
          })

          console.log({ownerRinkeby});
          const ownerBsc = await Moralis.Cloud.run('getUserNFTsBSC', {
               account_address: account,
               token_address: TOKEN_CONTRACT_ADDRESS_BSC
          })
          console.log({ownerBsc});
          fetchData({rinkeby: ownerRinkeby})
          fetchData({binance: ownerBsc})
          
     }
     useEffect(() => {
          account && getUserNFTs()
     }, [account])
     const fetchData = async (userNFT) => {
          console.log(userNFT);
          if(userNFT.rinkeby) {
               userNFT.rinkeby.map(async (item, index) => {
                    setMyNFT([])
                    //Tìm item đang bán
                    //Nếu đang bán thì gán uid = id ở trong market
                    //Nếu đang bán thì tìm kiếm giá đang bán gán vào price
                    const itemForSale = new Moralis.Query('ItemsForSale')
                    itemForSale.equalTo('tokenId', item.tokenId)
                    const result = await itemForSale.first()
                    console.log(result);
                    
                    const createItem = new Moralis.Query('CreateNFTs')
                    createItem.equalTo('tokenId', item.tokenId)
                    const createItemResult = await createItem.first()
                    console.log({createItemResult});
     
                    
                    await fetch(item.tokenUri)
                    .then(res => res.json())
                    .then(data => setMyNFT(prev => 
                         [
                              ...prev, 
                              {
                                   uid: result && result.attributes.tokenId === item.tokenId && result.attributes.uid,
                                   // uid: item.uid,
                                   tokenId: item.tokenId,
                                   symbol: item.symbol,
                                   image: data.image,
                                   name: item.name,
                                   price: result && result.attributes.tokenId === item.tokenId && result.attributes.askingPrice,
                                   isFrag: createItemResult.attributes.isFrag,
                                   amountFrag: createItemResult.attributes.amountFrag,
                                   attributes: data.attributes,
                                   animation_url: data.animation_url && data.animation_url ,
                                   blockchain: 'Rinkeby',
                                   chain: '4',
                                   hex: '0x4'
                              }
                         ]
                    ))
                    
                    
               })
          }
          if(userNFT.binance) {
               userNFT.binance.map(async (item, index) => {
                    setMyNFT([])
                    //Tìm item đang bán
                    //Nếu đang bán thì gán uid = id ở trong market
                    //Nếu đang bán thì tìm kiếm giá đang bán gán vào price
                    const itemForSale = new Moralis.Query('ItemsForSaleBsc')
                    itemForSale.equalTo('tokenId', item.tokenId)
                    const result = await itemForSale.first()
                    console.log(result);
                    
                    const createItem = new Moralis.Query('CreateNFTsBsc')
                    createItem.equalTo('tokenId', item.tokenId)
                    const createItemResult = await createItem.first()
                    console.log({createItemResult});
     
                    
                    await fetch(item.tokenUri)
                    .then(res => res.json())
                    .then(data => setMyNFT(prev => 
                         [
                              ...prev, 
                              {
                                   uid: result && result.attributes.tokenId === item.tokenId && result.attributes.uid,
                                   // uid: item.uid,
                                   tokenId: item.tokenId,
                                   symbol: item.symbol,
                                   image: data.image,
                                   name: item.name,
                                   price: result && result.attributes.tokenId === item.tokenId && result.attributes.askingPrice,
                                   isFrag: createItemResult.attributes.isFrag,
                                   amountFrag: createItemResult.attributes.amountFrag,
                                   attributes: data.attributes,
                                   animation_url: data.animation_url && data.animation_url,
                                   blockchain: 'Binance Testnet' ,
                                   chain: '97',
                                   hex: '0x61'
                              }
                         ]
                    ))
               })
          }
     }
     const handleSell = async () => {
          await checkNetWork(itemForSale.chain, itemForSale.hex)
          //Mở modal
          setShowForSale(true)
          if(itemForSale.chain === 'Rinkeby') {
               //Check xem đã approve chưa, nếu chưa thì approve
               //Nếu rồi thì rao bán
               await ensureMarketplaceIsApproved(TOKEN_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS)
               
               const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
               const priceToWei = await web3Api.web3.utils.toWei(itemForSale.price)
               //Add NFT vào market
               const receipt = 
                    await contract.methods.addItemToMarket(itemForSale.tokenId, TOKEN_CONTRACT_ADDRESS, priceToWei)
                    .send({from: account})
               console.log("addItemToMarket rinkeby",receipt);
          }
          else {
               //Check xem đã approve chưa, nếu chưa thì approve
               //Nếu rồi thì rao bán
               await ensureMarketplaceIsApproved(TOKEN_CONTRACT_ADDRESS_BSC, MARKET_CONTRACT_ADDRESS_BSC)
               
               const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS_BSC)
               const priceToWei = await web3Api.web3.utils.toWei(itemForSale.price)
               //Add NFT vào market
               const receipt = 
                    await contract.methods.addItemToMarket(itemForSale.tokenId, TOKEN_CONTRACT_ADDRESS_BSC, priceToWei)
                    .send({from: account})
               console.log("addItemToMarket bsc",receipt);
          }
     }
     //Open ModalForSale
     const handleForSale = async (item) => {
          await checkNetWork(item.chain, item.hex)
          setShowForSale(true)
          setItemForSale({
               ...itemForSale,
               tokenId: item.tokenId,
               image: item.image,
               chain: item.blockchain,
               hex: item.hex
          })
     }
     const handleCancelSale = async (nft) => {
          await checkNetWork(nft.chain, nft.hex)
          console.log("handleCancelSale",nft);
          if(nft.chain === '4') {
               const contractMarket = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
               const receipt = await contractMarket.methods.cancel(nft.uid).send({from: account});
               console.log("handleCancelSale receipt",receipt);
          }
          else {
               const contractMarket = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS_BSC)
               const receipt = await contractMarket.methods.cancel(nft.uid).send({from: account});
               console.log("handleCancelSale receipt",receipt);
          }
     }

     const ensureMarketplaceIsApproved = async (nftContract, marketContract) => {
          const contractToken = await new web3Api.web3.eth.Contract(NFTAPI, nftContract);
          console.log("contractToken", contractToken);
          const approvedAddress = await contractToken.methods.isApprovedForAll(
               account, marketContract
          ).call({from: account});
          console.log(approvedAddress);
          if (!approvedAddress){
               await contractToken.methods.setApprovalForAll(marketContract, true).send({from: account})
          }
     }
     const showMoreOptionList = (index) => {
          setIsShowMoreOptions({
               index,
               bool: !isShowMoreOptions.bool
          })
     }

     //Open ModalFragment
     const handleOpenModal = (nft) => {
          console.log("id", nft);
          if(nft.animation_url === undefined) {
               console.log("Frag Image");
               setShowPreparingFragNFTInfo(true)
               setPreparingFragNFTInfo({
                    ...preparingFragNFTInfo,
                    tokenId: nft.tokenId,
                    image: nft.image,
                    chain: nft.chain,
                    hex: nft.hex
               })
          }
          else {
               console.log("Frag Video");
               setShowModalFragmentVideo(true)
               setPreparingFragNFTVideoInfo({
                    ...preparingFragNFTVideoInfo, 
                    tokenId: nft.tokenId,
                    linkVideo: nft.animation_url,
                    chain: nft.chain,
                    hex: nft.hex
               })
          }
     }

     const handleFrag = async () => {
          await checkNetWork(preparingFragNFTInfo.chain, preparingFragNFTInfo.hex)
          console.log("acc",account);
          const id = toast.loading("Đang tạo phân mảnh NFT.....")
          let array = []
          array = await Promise.all(preparingFragNFTInfo.arrayImages.map(async (item, index) => {
               const cutImagesIpfs = await new saveFile("fragImage.png", {base64: item}, {saveIPFS: true})
               console.log("Hình phân ảnh",cutImagesIpfs._ipfs);
               const metadata = { 
                    image: cutImagesIpfs._ipfs ,
                    name: `Khi V${index + 60}`,
                    attributes: [ 
                         {
                              "trait_type": "ParentTokenId",
                              "value": preparingFragNFTInfo.tokenId.toString(),
                         },
                         {
                              "trait_type": "Position",
                              "value": index.toString(),
                         },
                         {
                              "trait_type": "Amount of fragmentation",
                              "value": preparingFragNFTInfo.arrayImages.length,
                         },
                    ]
               };
               const nftFileMetadataFile = new Moralis.File(
                    "metadata.json", 
                    {
                         base64 : btoa(JSON.stringify(metadata))
                    }
               );
               await nftFileMetadataFile.saveIPFS();
               const nftFileMetadataFilePath = await nftFileMetadataFile.ipfs();
               console.log("metadata",nftFileMetadataFilePath);
               return nftFileMetadataFilePath
          })
          )
          console.log("Day la mảng",array);
          if(preparingFragNFTInfo.chain === '4') {
               console.log("preparingFragNFTInfo.tokenId", preparingFragNFTInfo.tokenId);
               console.log('account', account);
               const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
               const receipt = await contract.methods.createCollection(array, preparingFragNFTInfo.tokenId).send({from: account})
               console.log(`receipt`,receipt);
               if(receipt.status) {
                    toast.update(id, { render: "Phân mảnh NFT thành công", type: "success", isLoading: false, autoClose: 5000});
               }
          }
          else {
               console.log('account', account);
               const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS_BSC)
               const receipt = await contract.methods.createCollection(array, preparingFragNFTInfo.tokenId).send({from: account})
               console.log(`receipt`,receipt);
               if(receipt.status) {
                    toast.update(id, { render: "Phân mảnh NFT thành công", type: "success", isLoading: false, autoClose: 5000});
               }
          }
     }
     
     useEffect(() => {
          console.log(myNFT);
     }, [myNFT])
     
     return (
          <div className='my-nft'>
               <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    />
                    {/* Same as */}
               <ToastContainer />
               <div className="my-nft-list">
               {itemForSale !== null && <ModalForSale onBuyNFT={handleSell}/>}
               {
                    preparingFragNFTInfo.image !== null && 
                         <ModalFragment 
                              onFrag={handleFrag}
                         />
               }
               {
                    preparingFragNFTVideoInfo.linkVideo !== null &&
                         <ModalFragmentVideo />
               }
               {
                    myNFT.map((item, index) => {
                         return(
                              <div 
                                   className="my-nft-item" 
                                   key={index} 
                              >
                                   {
                                        item.tokenId === playVideo ? 
                                        <div style={{height: 283}}>
                                             <ReactPlayer 
                                                  url={item.animation_url} 
                                                  width="100%" 
                                                  height="100%" 
                                                  controls={true}
                                             />
                                        </div>
                                        :
                                        <img 
                                             src={item.image} 
                                             alt={item.image} 
                                             crossOrigin="anonymous" 
                                             className='card-img-top'
                                             ref={imgRef}
                                        />
                                   } 
                                   <div className="card-body">
                                        {
                                             item.animation_url && 
                                             <div className="play-icon" onClick={() => setPlayVideo(item.tokenId)}>
                                                  <img src={PlayIcon} alt="" />
                                             </div>
                                        }
                                        <p className='my-nft-name'>{item.name}</p>
                                        <div className="d-flex align-items-center justify-content-between">
                                             <p className='my-nft-tokenId'>{item.tokenId}</p>
                                             {item.price 
                                             ? 
                                             <div className='d-flex align-items-center'>
                                                  <p className='text-secondary fw-600'>{(item.price / 1e18).toFixed(5)}</p>
                                                  {item.blockchain === 'Rinkeby' ? 
                                                  <img src={ETHIcon} alt="" className='eth-logo'/> 
                                                  : <img src={BNBIcon} alt="" className='eth-logo'/> 
                                                  }
                                             </div> 
                                                  : ''
                                             }
                                        </div>
                                   </div>
                                   <div className="more-options" onClick={() => showMoreOptionList(index)}>
                                        <div 
                                             className={`more-options-list 
                                             ${isShowMoreOptions.bool && isShowMoreOptions.index === index ? 'active' : ''}`}
                                        >
                                             {
                                                  !item.price && 
                                                  <div 
                                                       className='more-options-item' 
                                                       onClick={() => handleForSale(item)}
                                                  >
                                                       Rao bán
                                                  </div>
                                             }
                                             <a 
                                                  href={`https://testnets.opensea.io/assets/0x0bd9e2249f7d0b14dbb45985d5ce027739a6269c/${item.tokenId}`}
                                                  target='_blank'
                                             >
                                                  <div 
                                                       className='more-options-item'
                                                  >
                                                       Rao bán trên OpenSea
                                                  </div>
                                             </a>
                                             {
                                                  item.price && 
                                                  <div 
                                                       className='more-options-item'
                                                       onClick={() => handleCancelSale(item)}
                                                  >
                                                       Ngưng bán
                                                  </div>
                                             }
                                             {
                                                  !item.isFrag && 
                                                  <div 
                                                       className='more-options-item'
                                                       onClick={() => handleOpenModal(item)}
                                                  >
                                                       Phân mảnh
                                                  </div>
                                             }
                                             <Link to={`/detail/${item.tokenId}/${item.chain}`}>
                                                  <div 
                                                       className='more-options-item'
                                                  >
                                                       Xem chi tiết
                                                  </div>
                                             </Link>
                                        </div>
                                        <img src={DotIcon} alt={DotIcon} />
                                   </div>
                              </div>
                         )
                    })
               }
               </div>
          </div>
     )
}
