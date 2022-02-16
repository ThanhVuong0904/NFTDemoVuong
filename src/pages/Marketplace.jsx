import React, {useContext, useState, useEffect} from 'react'
import {Moralis} from 'moralis'
import { NFTContext } from '../contexts/NFTContext'
import {MarketplaceABI} from '../abiMarket'
import { NFTAPI } from '../abiContract'
import { MARKET_CONTRACT_ADDRESS , TOKEN_CONTRACT_ADDRESS} from '../constants/address'
import ETHIcon from '../assets/images/eth_logo.svg'
export default function Marketplace() {
     const { 
		account, web3Api,
	} = useContext(NFTContext);
     const [NFTs, setNFTs] = useState([])
     const getNFTs = async () => {
          const nft = await Moralis.Cloud.run('getItems')
          console.log(nft);
          fetchData(nft)
     }
     const fetchData = async (nft) => {
          nft.map(async item => {
               // const approve = await checkApprove(item.tokenId)
               await fetch(item.tokenUri)
               .then(res => res.json())
               .then(data => setNFTs(prev => 
                    [
                         ...prev, 
                         {
                              uid: item.uid,
                              tokenId: item.tokenId,
                              symbol: item.symbol,
                              image: data.image,
                              price: item.price,
                              ownerOf: item.ownerOf,
                         }
                    ]
               ))
          })
     }
     const handleBuyNFT = async (uid ,tokenId, price) => {
          console.log(uid ,tokenId, price);
          const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
          const receipt = 
               await contract.methods.buyItem(uid).send({from: account, value: price})
          console.log("buyItem",receipt);
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
                                        <p className='word-wrap'>
                                             <span>Owner: {item.ownerOf === account ? 'You' : item.ownerOf}</span>
                                        </p>
                                        <div className='d-flex align-items-center mt-4'>
                                             <p className='text-secondary fw-600'>{(item.price / 1e18).toFixed(10)}</p>
                                             <img src={ETHIcon} alt="" className='eth-logo'/>
                                        </div>
                                        <div className="my-nft-action">
                                             <button 
                                                  className='btn btn-primary'
                                                  disabled={item.ownerOf === account}
                                                  onClick={() => handleBuyNFT(item.uid ,item.tokenId, item.price)}
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
