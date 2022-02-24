import React, { useEffect, useContext, useState, useRef} from 'react'
import { Link } from 'react-router-dom'
import {Moralis} from 'moralis'
import { useMoralisFile } from 'react-moralis'
import { NFTContext } from '../contexts/NFTContext'
import {MarketplaceABI} from '../abiMarket'
import { NFTAPI } from '../abiContract'
import { TOKEN_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS } from '../constants/address'
import ETHIcon from '../assets/images/eth_logo.svg'
import ModalForSale from '../components/ModalForSale'
import DotIcon from '../assets/images/bx-dots-horizontal-rounded.svg'
import ModalFragment from '../components/ModalFragment'

export default function MyNFT() {
     const { 
		account, web3Api,
          setShowForSale,
          itemForSale, setItemForSale,
          preparingFragNFTInfo, setPreparingFragNFTInfo,
          setShowPreparingFragNFTInfo,
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
     const getUserNFTs = async () => {
          const owner = await Moralis.Cloud.run('getUserNFTs', {
               account_address: account,
               token_address: TOKEN_CONTRACT_ADDRESS
          })
          console.log(owner);
          fetchData(owner)
     }
     

     const fetchData = async (userNFT) => {
          userNFT.map(async (item, index) => {
               console.log(item);
               //Tìm item đang bán
               //Nếu đang bán thì gán uid = id ở trong market
               //Nếu đang bán thì tìm kiếm giá đang bán gán vào price
               const itemForSale = new Moralis.Query('ItemsForSale')
               itemForSale.equalTo('tokenId', item.tokenId)
               const result = await itemForSale.first()
               console.log(result);
               
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
                              isFrag: item.isFrag,
                              amountFrag: item.amountFrag,
                              attributes: data.attributes,
                         }
                    ]
               ))
          })
     }
     const handleSell = async () => {
          console.log(itemForSale.tokenId);
          //Mở modal
          setShowForSale(true)
          //Check xem đã approve chưa, nếu chưa thì approve
          //Nếu rồi thì rao bán
          await ensureMarketplaceIsApproved()
          
          const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
          const priceToWei = await web3Api.web3.utils.toWei(itemForSale.price)
          //Add NFT vào market
          const receipt = 
               await contract.methods.addItemToMarket(itemForSale.tokenId, TOKEN_CONTRACT_ADDRESS, priceToWei)
               .send({from: account})
          console.log("addItemToMarket",receipt);
     }
     //Open ModalForSale
     const handleForSale = async (item) => {
          setShowForSale(true)
          setItemForSale({
               ...itemForSale,
               tokenId: item.tokenId,
               image: item.image
          })
     }
     const handleCancelSale = async (nft) => {
          console.log("handleCancelSale",nft);
          const contractMarket = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
          const receipt = await contractMarket.methods.cancel(nft.uid).send({from: account});
          console.log("handleCancelSale receipt",receipt);
     }

     const ensureMarketplaceIsApproved = async () => {
          const contractToken = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS);
          console.log("contractToken", contractToken);
          const approvedAddress = await contractToken.methods.isApprovedForAll(
               account, MARKET_CONTRACT_ADDRESS
          ).call({from: account});
          console.log(approvedAddress);
          if (!approvedAddress){
               await contractToken.methods.setApprovalForAll(MARKET_CONTRACT_ADDRESS, true).send({from: account})
          }
     }
     const showMoreOptionList = (index) => {
          setIsShowMoreOptions({
               index,
               bool: !isShowMoreOptions.bool
          })
     }

     //Open ModalFragment
     const handleOpenModal = (id, image) => {
          setShowPreparingFragNFTInfo(true)
          setPreparingFragNFTInfo({
               ...preparingFragNFTInfo,
               tokenId: id,
               image: image,
          })
     }

     const handleFrag = async () => {
          console.log(preparingFragNFTInfo);
          let array = []
          array = await Promise.all(preparingFragNFTInfo.arrayImages.map(async (item, index) => {
               const cutImagesIpfs = await new saveFile("mouth.png", {base64: item}, {saveIPFS: true})
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
          const contract = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
          const receipt = await contract.methods.createCollection(array, preparingFragNFTInfo.tokenId).send({from: account})
          console.log(`receipt`,receipt);
     }
     useEffect(() => {
          account && getUserNFTs()
     }, [account])
     useEffect(() => {
          console.log(myNFT);
     }, [myNFT])
     
     return (
          <div className='my-nft'>
               <div className="my-nft-list">
               {itemForSale !== null && <ModalForSale onBuyNFT={handleSell}/>}
               {
                    preparingFragNFTInfo.image !== null && 
                         <ModalFragment 
                              onFrag={handleFrag}
                         />
               }
               {
                    myNFT.map((item, index) => {
                         // const metadata = JSON.parse(item.metadata)
                         return(
                              <div 
                                   className="my-nft-item" 
                                   key={index} 
                              >
                                   <img 
                                        src={item.image} 
                                        alt={item.image} 
                                        crossOrigin="anonymous" 
                                        className='card-img-top'
                                        ref={imgRef}
                                   /> 
                                   <div className="card-body">
                                        <p className='my-nft-name'>{item.name}</p>
                                        <div className="d-flex align-items-center justify-content-between">
                                             <p className='my-nft-tokenId'>{item.tokenId}</p>
                                             {item.price 
                                             ? 
                                             <div className='d-flex align-items-center'>
                                                  <p className='text-secondary fw-600'>{(item.price / 1e18).toFixed(5)}</p>
                                                  <img src={ETHIcon} alt="" className='eth-logo'/>
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
                                                       onClick={() => handleOpenModal(
                                                            item.tokenId, 
                                                            item.image, 
                                                       )}
                                                  >
                                                       Phân mảnh
                                                  </div>
                                             }
                                             <Link to={`/detail/${item.tokenId}`}>
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
