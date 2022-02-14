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
               itemForSale.equalTo('tokenAddress', TOKEN_CONTRACT_ADDRESS)
               const result = await itemForSale.first()
               console.log(result);

               //Kiểm tra xem NFT này đã được aprrove vào market này chưa
               const contractToken = new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS);
               const approvedAddress = await contractToken.methods.getApproved(item.tokenId).call({from: account});
               //Nếu được approve rồi thì có nghĩa là đang bán, gán onSale = true
               //Nếu chưa thì ngược lại
               const isApprove = approvedAddress === MARKET_CONTRACT_ADDRESS ? true : false
               await fetch(item.tokenUri)
               .then(res => res.json())
               .then(data => setMyNFT(prev => 
                    [
                         ...prev, 
                         {
                              // uid: result && result.attributes.tokenId === item.tokenId && result.attributes.uid,
                              uid: item.uid,
                              tokenId: item.tokenId,
                              symbol: item.symbol,
                              image: data.image,
                              name: item.name,
                              onSale: isApprove,
                              marketPlace: approvedAddress,
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
          await ensureMarketplaceIsApproved(itemForSale.tokenId, TOKEN_CONTRACT_ADDRESS)
          const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
          const priceToWei = await web3Api.web3.utils.toWei(itemForSale.price)
          //Add NFT vào market
          const receipt = 
               await contract.methods.addItemToMarket( itemForSale.tokenId, TOKEN_CONTRACT_ADDRESS,priceToWei)
               .send({from: account})
          console.log("addItemToMarket",receipt);
     }
     const handleForSale = async (item) => {
          setShowForSale(true)
          setItemForSale({
               ...itemForSale,
               tokenId: item.tokenId,
               image: item.image
          })
     }
     const handleCancelSale = async (nft) => {
          console.log(nft);
          const contractMarket = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
          const contractToken = await new web3Api.web3.eth.Contract(NFTAPI, TOKEN_CONTRACT_ADDRESS)
          const approvedAddress = await contractToken.methods.getApproved(nft.tokenId).call({from: account})
          const receipt = await contractMarket.methods.cancel(nft.uid, nft.tokenId).send({from: account});
          console.log(receipt);
          console.log(approvedAddress);
          //Nếu NFT đang approve cho market này, thì có nghĩa là đang bán
          //Hủy approve = cách approve cho address zero
          if(approvedAddress === MARKET_CONTRACT_ADDRESS) {
               const cancelApprove = await contractToken.methods.approve("0x0000000000000000000000000000000000000000" ,nft.tokenId).send({from: account});
               console.log(cancelApprove);
          }
          
     }
     const ensureMarketplaceIsApproved = async (tokenId, tokenAddress) => {
          const contract = new web3Api.web3.eth.Contract(NFTAPI, tokenAddress);
          const approvedAddress = await contract.methods.getApproved(tokenId).call({from: account});
          console.log("approvedAddress", approvedAddress);
          if (approvedAddress != MARKET_CONTRACT_ADDRESS){
              const approve = await contract.methods.approve(MARKET_CONTRACT_ADDRESS,tokenId).send({from: account});
              console.log("approve", approve);
          }
     }
     const showMoreOptionList = (index) => {
          setIsShowMoreOptions({
               index,
               bool: !isShowMoreOptions.bool
          })
     }
     const handleOpenModal = (id, image, width, height) => {
          setShowPreparingFragNFTInfo(true)
          setPreparingFragNFTInfo({
               ...preparingFragNFTInfo,
               tokenId: id,
               image: image,
               width,
               height
          })
     }
     const handleCutImage = async (item, index) => {
          console.log(item, preparingFragNFTInfo);
          const querySelect = document.querySelector(`image-${index}`)
          console.log(querySelect);
          var image = new Image
          image.crossOrigin = "anonymous"
          image.src = item.image

          
          var imagePieces = [];
          if(preparingFragNFTInfo.qtyFrag === '4') {
               console.log("ok");
          }
          var numColsToCut 
          var numRowsToCut
          if(preparingFragNFTInfo.qtyFrag === '4') {
               numColsToCut = 2
               numRowsToCut = 2
          }
          if(preparingFragNFTInfo.qtyFrag === '9') {
               numColsToCut = 3
               numRowsToCut = 3
          }
          if(preparingFragNFTInfo.qtyFrag === '16') {
               numColsToCut = 4
               numRowsToCut = 4
          }
          var widthOfOnePiece = image.naturalWidth / numColsToCut
          var heightOfOnePiece = image.naturalHeight / numRowsToCut
          for(var x = 0; x < numColsToCut; ++x) {
               for(var y = 0; y < numRowsToCut; ++y) {
                    var canvas = document.createElement('canvas');
                    canvas.width = widthOfOnePiece;
                    canvas.height = heightOfOnePiece;
                    var context = canvas.getContext('2d');
                    context.drawImage(
                         image, 
                         y * heightOfOnePiece, 
                         x * widthOfOnePiece, 
                         heightOfOnePiece, 
                         widthOfOnePiece, 
                         0, 
                         0, 
                         canvas.height,
                         canvas.width, 
                    );
                    const myPromise = new Promise( 
                         (res, rej) => res(canvas.toDataURL())
                    )
                    imagePieces.push(myPromise)
               }
          }
          Promise.all(imagePieces).then(async (data) => {
               console.log(data);
               // setCutImages(data)
               setPreparingFragNFTInfo({
                    ...preparingFragNFTInfo,
                    arrayImages: data
               })
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
                              onCutImage={() => handleCutImage(preparingFragNFTInfo)}
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
                                             {item.onSale 
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
                                                  !item.onSale && 
                                                  <div 
                                                       className='more-options-item' 
                                                       onClick={() => handleForSale(item)}
                                                  >
                                                       Rao bán
                                                  </div>
                                             }
                                             {
                                                  item.onSale && 
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
