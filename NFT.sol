// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTCollection is ERC721 {
    using Counters for Counters.Counter;
    struct NFT {
        uint256 tokenId;
        uint256 parentTokenId;
        uint256 amountFrag;
        address creator;
        string uri;
        bool isFrag;
    }

    
    event CreateNFT(address creator, uint256 tokenId, uint256 parentTokenId, uint256 amountFrag ,bool isFrag, string uri);
    event FragNFT(uint256 parentTokenId, uint256 amountFrag);
    mapping (uint256 => NFT) public NFTs;

    uint256 tokenId = 1;
    uint256 NULL = 0;
    constructor() ERC721("NFTCollection", "CoNFT") {}

    function createNFT(string memory uri, uint256 parentTokenId) public {

        
        if(parentTokenId > 0) {
            NFTs[tokenId] = NFT(tokenId, parentTokenId, 0, msg.sender, uri, false);
            emit CreateNFT(
            msg.sender, 
            NFTs[tokenId].tokenId, 
            NFTs[tokenId].parentTokenId, 
            NFTs[tokenId].amountFrag ,
            NFTs[tokenId].isFrag,
            NFTs[tokenId].uri
            );
        }
        else {
            NFTs[tokenId] = NFT(tokenId, NULL, 0, msg.sender, uri, false);
            emit CreateNFT(
            msg.sender, 
            NFTs[tokenId].tokenId, 
            NFTs[tokenId].parentTokenId, 
            NFTs[tokenId].amountFrag ,
            NFTs[tokenId].isFrag,
            NFTs[tokenId].uri
            );
        }


        _safeMint(msg.sender, tokenId);
        tokenId++;
        
        
    }

    function tokenURI(uint256 tokenID) public view override returns (string memory) {
        require(_exists(tokenID), "ERC721Metadata: URI query for nonexistent token");

       return NFTs[tokenID].uri;
    }

    function createCollection(string [] memory _uri, uint256 parentTokenId) public{
        //So sánh nếu = true thì sẽ lỗi
        require(NFTs[parentTokenId].isFrag = true, "NFT already fragmented");
        for(uint i = 0; i < _uri.length; i++) {
            createNFT(_uri[i], parentTokenId);
            NFTs[parentTokenId].isFrag = true;
            NFTs[parentTokenId].amountFrag = _uri.length;
        }
        emit FragNFT(parentTokenId, _uri.length);
    }
     function getAllNFT() public view returns (NFT[] memory) {
        NFT[] memory result = new NFT[](tokenId);
        for (uint256 i = 1; i < tokenId; i++) {
            result[i] = NFTs[i];
        }
        return result;
    }
}