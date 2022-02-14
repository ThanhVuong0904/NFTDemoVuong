// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Marketplace {
    struct AuctionItem {
        uint256 id;
        address tokenAddress;
        uint256 tokenId;
        address payable seller;
        uint256 askingPrice;
        bool onSale;
    }

    //AuctionItem[] public itemsForSale;
    mapping (uint256 => AuctionItem) public _auctionItem;

    uint256 _listingId = 0;

    event ItemAdded(uint256 id, uint256 tokenId, address tokenAddress, uint256 askingPrice, bool onSale);
    event ItemSold(uint256 id, address buyer, uint256 askingPrice);
    event Cancel(uint256 listingId, uint256 tokenId ,address caller, address tokenAddress);

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

    modifier IsForSale(uint256 id){
        require(_auctionItem[id].onSale == false, "Item is already sold!");
        _;
    }

    function addItemToMarket(uint256 tokenId, address tokenAddress, uint256 askingPrice) OnlyItemOwner(tokenAddress,tokenId) HasTransferApproval(tokenAddress,tokenId) external {
        
        _auctionItem[_listingId] = AuctionItem(_listingId, tokenAddress, tokenId, payable(msg.sender), askingPrice, true);
        //++ id truoc nen no luu vao event sai
        _listingId++;
        emit ItemAdded(_listingId, tokenId, tokenAddress, askingPrice, true);
    }

    function buyItem(uint256 id) payable external HasTransferApproval(_auctionItem[id].tokenAddress,_auctionItem[id].tokenId){
        require(msg.value >= _auctionItem[id].askingPrice, "Not enough funds sent");
        require(msg.sender != _auctionItem[id].seller);

        _auctionItem[id].onSale = false;


        IERC721(_auctionItem[id].tokenAddress).safeTransferFrom(_auctionItem[id].seller, msg.sender, _auctionItem[id].tokenId);
        
        _auctionItem[id].seller.transfer(msg.value);

        emit ItemSold(id, msg.sender,_auctionItem[id].askingPrice);
    }
    function cancel(uint256 listingId, uint256 tokenId) public HasTransferApproval(_auctionItem[listingId].tokenAddress, _auctionItem[listingId].tokenId){

		_auctionItem[listingId].onSale = false;
	
        IERC721 tokenContract = IERC721(_auctionItem[listingId].tokenAddress);
		tokenContract.approve(0x0000000000000000000000000000000000000000, tokenId);

		emit Cancel(listingId, tokenId, msg.sender, _auctionItem[listingId].tokenAddress);
	}
}