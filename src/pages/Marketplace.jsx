import React, {useContext, useState, useEffect} from 'react'
import {Moralis} from 'moralis'
import { NFTContext } from '../contexts/NFTContext'
import {MarketplaceABI} from '../abiMarket'
import { MARKET_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS_BSC } from '../constants/address'
import ETHIcon from '../assets/images/eth_logo.svg'
import BNBIcon from '../assets/images/bnb_logo.png'
export default function Marketplace() {
     const { 
		account, web3Api, checkNetWork
	} = useContext(NFTContext);
     const [NFTs, setNFTs] = useState([])
     const getNFTs = async () => {
          // const nft = await Moralis.Cloud.run('getItems')
          // console.log(nft);
          // fetchData(nft)
          const ItemForSale = new Moralis.Query('ItemsForSale')
          ItemForSale.select(
               "uid",
               "askingPrice",
               "tokenAddress",
               "tokenId", 
               "token.token_uri", 
               "token.symbol",
               "token.owner_of",
               "token.id"
          );
          const ItemForSaleResults = await ItemForSale.find();
          
          const ItemForSaleBsc = new Moralis.Query('ItemsForSaleBsc')
          ItemForSaleBsc.select(
               "uid",
               "askingPrice",
               "tokenAddress",
               "tokenId", 
               "token.token_uri", 
               "token.symbol",
               "token.owner_of",
               "token.id"
          );
          const ItemForSaleBscResults = await ItemForSaleBsc.find();
          fetchData({rinkeby: ItemForSaleResults})
          fetchData({binance: ItemForSaleBscResults})

     }
     const fetchData = async (nft) => {
          if(nft.rinkeby) {
               nft.rinkeby.map(async item => {
                    setNFTs([])
                    // const approve = await checkApprove(item.tokenId)
                    console.log("item", item.attributes.askingPrice);
                    await fetch(item.attributes.token.attributes.token_uri)
                    .then(res => res.json())
                    // .then(dataa => console.log(dataa))
                    .then(data => setNFTs(prev => 
                         [
                              ...prev, 
                              {
                                   uid: item.attributes.uid,
                                   tokenId: item.attributes.tokenId,
                                   symbol: item.attributes.token.attributes.symbol,
                                   image: data.image,
                                   price: item.attributes.askingPrice,
                                   ownerOf: item.attributes.token.attributes.owner_of,
                                   blockchain: 'Rinkeby',
                                   chain: '4',
                                   hex: '0x4'
                              }
                         ]
                    ))
               })
          }
          if(nft.binance) {
               nft.binance.map(async item => {
                    setNFTs([])
                    // const approve = await checkApprove(item.tokenId)
                    console.log("item", item.attributes.askingPrice);
                    await fetch(item.attributes.token.attributes.token_uri)
                    .then(res => res.json())
                    // .then(dataa => console.log(dataa))
                    .then(data => setNFTs(prev => 
                         [
                              ...prev, 
                              {
                                   uid: item.attributes.uid,
                                   tokenId: item.attributes.tokenId,
                                   symbol: item.attributes.token.attributes.symbol,
                                   image: data.image,
                                   price: item.attributes.askingPrice,
                                   ownerOf: item.attributes.token.attributes.owner_of,
                                   blockchain: 'Binance',
                                   chain: '97',
                                   hex: '0x61'
                              }
                         ]
                    ))
               })
          }
     }

     const handleBuyNFT = async (nft) => {
          await checkNetWork(nft.chain, nft.hex)
          if(nft.chain === '4') {
               const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
               const receipt = 
                    await contract.methods.buyItem(nft.uid).send({from: web3Api.currentAccount, value: nft.price})
               console.log("buyItem rinkeby",receipt);
          } 
          else {
               const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS_BSC)
               const receipt = 
                    await contract.methods.buyItem(nft.uid).send({from: web3Api.currentAccount, value: nft.price})
               console.log("buyItem bsc",receipt);
          }
     }
     useEffect(() => {
          account && getNFTs()
     }, [account])
     
     return (
          <div className='market'>
               <div className="d-grid-col-3">
               {
                    NFTs.map((item, index) => {
                         console.log(item);
                         return (
                              <div 
                                   className={`my-nft-item`} 
                                   key={index} 
                              >
                                   <img src={item.image} alt="" /> 
                                   <div className="card-body">
                                        <div className='d-flex align-items-center justify-content-between'>
                                             <p className='text-primary fw-600'>{item.symbol}</p>
                                             <p className='text-secondary fw-600'>{item.tokenId}</p>
                                        </div>
                                        <div className='d-flex'>
                                             <span>Owner:</span> 
                                             <span className='word-wrap' style={{maxWidth: 300}}>{item.ownerOf === account ? 'You' : item.ownerOf}</span>
                                        </div>
                                        <div className='d-flex align-items-center mt-4'>
                                             <p className='text-secondary fw-600'>{(item.price / 1e18).toFixed(10)}</p>
                                             {item.blockchain === 'Rinkeby' ? 
                                             <img src={ETHIcon} alt="" className='eth-logo'/> 
                                             : <img src={BNBIcon} alt="" className='eth-logo'/> 
                                             }
                                        </div>
                                        <div>
                                             Blockchain : {item.blockchain}
                                        </div>
                                        <div className="my-nft-action">
                                             <button 
                                                  className='btn btn-primary'
                                                  disabled={item.ownerOf === account}
                                                  onClick={() => handleBuyNFT(item)}
                                             >
                                                       Buy now
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         )
                    })
               }
               </div>
          </div>
     )
}
