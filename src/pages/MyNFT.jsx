import React, { useEffect, useContext, useState } from 'react'
import {Moralis} from 'moralis'
import { NFTContext } from '../contexts/NFTContext'
import {MarketplaceABI} from '../abiMarket'
import { abiMYTOKENTV } from '../abiContract'
import { TestAbi } from '../abjTest'
import { TOKEN_CONTRACT_ADDRESS, MARKET_CONTRACT_ADDRESS } from '../constants/address'
import ModalForSale from '../components/ModalForSale'
export default function MyNFT() {
     const MARKET_CONTRACT = '0xf8A1aeEd71169A7d9B438d4b4361849e6EbfB7AD'
     const { 
		account, web3Api,
          showForSale, setShowForSale,
          askingPrice, setAskingPrice,
          itemForSale, setItemForSale
	} = useContext(NFTContext);
     const [myNFT, setMyNFT] = useState([])

     const getUserNFTs = async () => {
          const owner = await Moralis.Cloud.run('getUserNFTs', {
               account_address: account
          })
          console.log(owner);
          fetchData(owner)
     }

     const fetchData = async (nft) => {
          nft.map(async item => {
               await fetch(item.tokenUri)
               .then(res => res.json())
               .then(data => setMyNFT(prev => 
                    [
                         ...prev, 
                         {
                              tokenId: item.tokenId,
                              symbol: item.symbol,
                              image: data.image,
                              name: item.name
                         }
                    ]
               ))
          })
     }
     // const handleForSale = async (tokenId) => {
     //      console.log(tokenId);
     //      // setShowForSale(true)
     //      await ensureMarketplaceIsApproved(tokenId, TOKEN_CONTRACT_ADDRESS)
     //      const contract = await new web3Api.web3.eth.Contract(MarketplaceABI, MARKET_CONTRACT_ADDRESS)
     //      console.log(contract);
     //      const receipt = 
     //           await contract.methods.addItemToMarket(tokenId, TOKEN_CONTRACT_ADDRESS, askingPrice)
     //           .send({from: account})
     //      console.log("receipt",receipt);
     // }
     const handleForSale = async (item) => {
          setShowForSale(true)
          setItemForSale({
               tokenId: item.tokenId,
               image: item.image
          })
     }
     const ensureMarketplaceIsApproved = async (tokenId, tokenAddress) => {
          const contract = new web3Api.web3.eth.Contract(abiMYTOKENTV, tokenAddress);
          const approvedAddress = await contract.methods.getApproved(tokenId).call({from: account});
          if (approvedAddress != MARKET_CONTRACT_ADDRESS){
              await contract.methods.approve(MARKET_CONTRACT_ADDRESS,tokenId).send({from: account});
          }
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
               {itemForSale !== null && <ModalForSale onBuyNFT={handleForSale}/>}
               {
                    myNFT.map((item, index) => {
                         // const metadata = JSON.parse(item.metadata)
                         return(
                              <div 
                                   className="my-nft-item" 
                                   key={index} 
                              >
                                   <img src={item.image} alt="" /> 
                                   <div className="card-body">
                                        <p className='my-nft-name'>{item.name}</p>
                                        <p className='my-nft-tokenId'>{item.tokenId}</p>
                                        <div className="my-nft-action">
                                             <button 
                                                  onClick={() => handleForSale(item)} 
                                                  className='btn btn-primary'
                                             >
                                                  Sell
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
