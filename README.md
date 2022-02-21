# NFT Demo

## Setup mạng Rinkeby (Testnet)
1. Chọn mạng Rinkeby

![image](https://user-images.githubusercontent.com/68543789/150730786-73c38b9b-6b21-4668-ba19-eadc66d917f2.png)

2. Nạp 1 ít tiền vào ví từ https://faucets.chain.link/rinkeby?_ga=2.194193700.840943072.1643004605-1693912681.1641270658


## Contract

Contract được viết trên https://remix.ethereum.org/ và đã Deploy


Contract address: `0xb58722a57AB337e0ed3e159168182546f14da997`

ABI của contract được lưu ở `./src/abiContract.js`

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyTokenTV is ERC721, Ownable {
    using Counters for Counters.Counter;
    struct Item {
        uint256 id;
        address creator;
        string uri;
    }
    mapping (uint256 => Item) public Items;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MyTokenTV", "MTKTV") {}

    function createItem(string memory uri) public returns (uint256){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);

        Items[tokenId] = Item(tokenId, msg.sender, uri);

        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

       return Items[tokenId].uri;
    }
}
```



## Run App

Đề chạy dự án cần làm như sau
- Mở terminal và gõ lệnh

`npm start` 

- Mở thêm 1 terminal nữa để chạy file `server.js` bằng cách

`node server`

![image](https://user-images.githubusercontent.com/68543789/150733579-7f89c575-87bf-4df2-b885-3b6a06ea9675.png)

