import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import {Moralis} from 'moralis'
import { useState } from 'react';
import { useContext } from 'react';
import { NFTContext } from '../contexts/NFTContext';
import { TOKEN_CONTRACT_ADDRESS } from '../constants/address';
import ReactPlayer from 'react-player';

export default function NFTDetail() {
     let {id} = useParams()
     const {account} = useContext(NFTContext)
     console.log(id);
     const [NFTDetail, setNFTDetail] = useState({
          image: '',
          imageParent: '',
          isFrag: null,
          amountFrag: '',
          amountFragOfParent: '',
          parentTokenId: '',
          imageSameParent:[],
          imageChild: []
     })
     useEffect(() => {
          const fetchData = async () => {
               const queryNFT = new Moralis.Query('CreateNFTs')
               queryNFT.equalTo('tokenId', id)
               const resultQueryNFT = await queryNFT.first()
               console.log("NFT", resultQueryNFT);
               const thisImage = await fetch(resultQueryNFT.attributes.uri)
               const resThisImage = await thisImage.json()
               
               //Tìm parent của NFT này
               const queryNFTParent = new Moralis.Query('CreateNFTs')
               queryNFTParent.equalTo('tokenId', resultQueryNFT.attributes.parentTokenId)
               const resultQueryNFTParent = await queryNFTParent.first()
               console.log("resultQueryNFTParent", resultQueryNFTParent);

               //Nếu không tìm thấy parent
               //=> NFT này là gốc luôn
               if(resultQueryNFTParent === undefined) {
                    console.log("1");
                    const queryNFTsChild = new Moralis.Query('CreateNFTs')
                    queryNFTsChild.equalTo('parentTokenId', id)
                    const resultQueryNFTsChild = await queryNFTsChild.find()
                    console.log("ok con de");
                    const imageChild = await Promise.all(resultQueryNFTsChild.map(async item => {
                         const response = await fetch(item.attributes.uri)
                         const data = await response.json()
                         const options = { address: TOKEN_CONTRACT_ADDRESS, chain: "rinkeby", token_id: item.attributes.tokenId };
                         const nftOwner = await Moralis.Web3API.token.getTokenIdMetadata(options);
                         const object = {
                              image: data.image,
                              animation_url: data.animation_url && data.animation_url,
                              tokenId: item.attributes.tokenId,
                              nftOwner: nftOwner.owner_of
                         }
                         return object
                    }))
                    console.log("Mảng phân mảnh", imageChild);
                    setNFTDetail({
                         ...NFTDetail,
                         image: resThisImage.image,
                         animation_url: resThisImage.animation_url && resThisImage.animation_url,
                         imageChild: imageChild,
                         amountFrag: resultQueryNFT.attributes.amountFrag,
                         // amountFragOfParent: resultQueryNFTParent.attributes.amountFrag,
                         isFrag: resultQueryNFT.attributes.isFrag,
                         parentTokenId: resultQueryNFT.attributes.parentTokenId,
                    })
               }
               else {
                    console.log("2");
                    const queryNFTsSameParentId = new Moralis.Query('CreateNFTs')
                    queryNFTsSameParentId.equalTo('parentTokenId', resultQueryNFT.attributes.parentTokenId)
                    const resultQueryNFTsSameParentId = await queryNFTsSameParentId.find()
                    console.log("queryNFTsSameParentId", resultQueryNFTsSameParentId);
                    
                    const fetchImageParent = await fetch(resultQueryNFTParent.attributes.uri)
                    const resImageParent = await fetchImageParent.json()

                    const imageSameParent = await Promise.all(resultQueryNFTsSameParentId.map(async item => {
                         const response = await fetch(item.attributes.uri)
                         const data = await response.json()
                         const options = { address: TOKEN_CONTRACT_ADDRESS, chain: "rinkeby", token_id: item.attributes.tokenId };
                         const nftOwner = await Moralis.Web3API.token.getTokenIdMetadata(options);
                         const object = {
                              image: data.image,
                              animation_url: data.animation_url && data.animation_url,
                              tokenId: item.attributes.tokenId,
                              nftOwner: nftOwner.owner_of
                         }
                         return object
                    }))

                    const queryNFTsChild = new Moralis.Query('CreateNFTs')
                    queryNFTsChild.equalTo('parentTokenId', resultQueryNFT.attributes.tokenId)
                    const resultQueryNFTsChild = await queryNFTsChild.find()
                    console.log("resultQueryNFTsChild", resultQueryNFTsChild);

                    const imageChild = await Promise.all(resultQueryNFTsChild.map(async item => {
                         const response = await fetch(item.attributes.uri)
                         const data = await response.json()
                         const options = { address: TOKEN_CONTRACT_ADDRESS, chain: "rinkeby", token_id: item.attributes.tokenId };
                         const nftOwner = await Moralis.Web3API.token.getTokenIdMetadata(options);
                         const object = {
                              image: data.image,
                              animation_url: data.animation_url && data.animation_url,
                              tokenId: item.attributes.tokenId,
                              nftOwner: nftOwner.owner_of
                         }
                         return object
                    }))
                    const options = { 
                         address: TOKEN_CONTRACT_ADDRESS, 
                         token_id: resultQueryNFT.attributes.parentTokenId, 
                         chain: "rinkeby" 
                    };
                    const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
                    console.log("tokenIdOwners", tokenIdOwners);
                    setNFTDetail({
                         ...NFTDetail,
                         image: resThisImage.image,
                         animation_url: resThisImage.animation_url && resThisImage.animation_url,
                         imageSameParent: imageSameParent,
                         imageChild: imageChild,
                         amountFrag: resultQueryNFT.attributes.amountFrag,
                         amountFragOfParent: resultQueryNFTParent.attributes.amountFrag,
                         isFrag: resultQueryNFT.attributes.isFrag,
                         parentTokenId: resultQueryNFT.attributes.parentTokenId,
                         imageParent: resImageParent.image,
                         animation_url_parent: resImageParent.animation_url && resImageParent.animation_url,
                         ownerOfParent: tokenIdOwners.result[0].owner_of
                    })
               }
          }
          fetchData()
     },[id, account])
     useEffect(() => {
          console.log("NFTDetail",NFTDetail);
     }, [NFTDetail, id])
     return (
          <div>
               <div className='nft-detail d-flex'>
                    <div className="nft-detail-image">
                         {
                              NFTDetail.animation_url && 
                              <ReactPlayer 
                              width='100%'
                              height='100%'
                              controls={true} 
                              url={NFTDetail.animation_url}
                              />
                         }
                         {
                              !NFTDetail.animation_url && <img src={NFTDetail.image} alt="" />
                         }
                         <p className='text-secondary fw-600'>Token ID: {id}</p>
                         {
                              NFTDetail.parentTokenId === '0' ? 
                              <p>Đây là NFT nguyên thủy</p> : 
                              <p>Phân mảnh của NFT: {NFTDetail.parentTokenId}</p>
                         }
                         {NFTDetail.isFrag ? 
                         <p>Số lượng phân mảnh: {NFTDetail.amountFrag}</p> : 
                         <p>NFT này chưa phân mảnh</p>}
                         
                    </div>
                    <div className={`nft-detail-images d-grid grid-col-${Math.sqrt(NFTDetail.amountFrag)} grid-gap-10`}>
                         {
                              NFTDetail.imageChild.map(item => 
                                   <div 
                                        key = {item.tokenId}
                                        className={
                                             `
                                                  ${item.nftOwner !== account ? 'opacity' : ''}
                                                  ${item.tokenId === id ? 'border-blue': ''}
                                             `
                                        }
                                   >
                                        {item.animation_url && 
                                        <ReactPlayer 
                                             width='100%'
                                             height='100%'
                                             controls={true} 
                                             url={item.animation_url}
                                        />
                                        }
                                        {!item.animation_url && 
                                             <img className='w100' src={item.image} alt="" />
                                        }
                                        
                                   </div>
                              )
                         }
                    </div>
               </div>
               <h3 className='mt-4'>Đây là NFT cha</h3>
               <div className='nft-detail-parent d-flex'>
                    <div className="nft-detail-image">
                         {NFTDetail.animation_url_parent && 
                         <ReactPlayer 
                              width='100%'
                              height='100%'
                              controls={true} 
                              url={NFTDetail.animation_url_parent}
                         />
                         }
                         {!NFTDetail.animation_url_parent && <img src={NFTDetail.imageParent} alt="" />}

                         <p>Token ID: {NFTDetail.parentTokenId}</p>
                         <p>Số lượng phân mảnh: {NFTDetail.amountFragOfParent}</p>
                         <p>Sở hữu bởi: {NFTDetail.ownerOfParent}</p>
                    </div>
                    <div className={`nft-detail-images d-grid grid-col-${Math.sqrt(NFTDetail.amountFragOfParent)} grid-gap-10`}>
                         {
                              NFTDetail.imageSameParent.map(item => 
                                   <div 
                                        key = {item.tokenId}
                                        className={`
                                             ${item.nftOwner !== account && 'opacity'} 
                                             ${item.tokenId === id && 'border-blue'}`
                                        }
                                   >
                                        {item.animation_url && 
                                        <ReactPlayer 
                                             width='100%'
                                             height='100%'
                                             controls={true} 
                                             url={item.animation_url}
                                        />
                                        }
                                        {!item.animation_url &&<img className='w100' src={item.image} alt="" /> }
                                   </div>
                              )
                         }
                    </div>
               </div>
          </div>
     )
}
