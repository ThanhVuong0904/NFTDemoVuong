// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Marketplace {
    struct AuctionItem {
        uint256 id;
        uint256 tokenId;
        address tokenAddress;
        address payable seller;
        uint256 askingPrice;
    }

    //AuctionItem[] public itemsForSale;
    mapping (uint256 => AuctionItem) public _auctionItem;

    uint256 _listingId = 0;

    event ItemAdded(uint256 id, uint256 tokenId, address tokenAddress, uint256 askingPrice);
    event ItemSold(uint256 id, uint256 tokenId);
    event Cancel(uint256 id, uint256 tokenId);

    function ownerOf(address tokenAddress, uint256 tokenId) public view  returns (address) {
        IERC721 tokenContract = IERC721(tokenAddress);
        return tokenContract.ownerOf(tokenId);
    }

    modifier OnlyItemOwner(address tokenAddress, uint256 tokenId){
        IERC721 tokenContract = IERC721(tokenAddress);
        require(tokenContract.ownerOf(tokenId) == msg.sender);
        _;
    }

    modifier HasTransferApproval(address tokenAddress, uint256 tokenId){
        IERC721 tokenContract = IERC721(tokenAddress);
        require(tokenContract.getApproved(tokenId) == address(this));
        _;
    }

    modifier ItemExists(uint256 id){
        require(_auctionItem[id].id == id, "Could not find item");
        _;
    }


    function addItemToMarket(uint256 tokenId, address tokenAddress, uint256 askingPrice) OnlyItemOwner(tokenAddress,tokenId)  external {
        
        _auctionItem[_listingId] = AuctionItem(_listingId, tokenId, tokenAddress, payable(msg.sender), askingPrice);
        emit ItemAdded(_listingId, tokenId, tokenAddress, askingPrice);
        _listingId++;
    }


    function buyItem(uint256 id) payable external {
        require(msg.value >= _auctionItem[id].askingPrice, "Not enough funds sent");
        require(msg.sender != _auctionItem[id].seller);



        IERC721(_auctionItem[id].tokenAddress).safeTransferFrom(_auctionItem[id].seller, msg.sender, _auctionItem[id].tokenId);
        
        _auctionItem[id].seller.transfer(msg.value);

        emit ItemSold(id, _auctionItem[id].tokenId);
    }

    function cancel(uint256 id) public{

		emit Cancel(id, _auctionItem[id].tokenId);
	}

}