Moralis.Cloud.define("getUserNFTs", async (request) => {
     const queryCreateNFT = new Moralis.Query("CreateNFTs");
   const queryItemsForSale = new Moralis.Query("ItemsForSale");
   const query = new Moralis.Query("EthNFTOwners");
   query.equalTo("token_address", request.params.token_address);
   query.equalTo("owner_of", request.params.account_address);
   const queryResults = await query.find();
   const queryResultCreateNFT = await queryCreateNFT.find();
   const queryResulItemsForSale = await queryItemsForSale.find();

   const results = [];
   let isFrag;
   let amountFrag;
   let uid;
   for (let i = 0; i < queryResults.length; ++i) {
        for(let u = 0; u < queryResultCreateNFT.length; u++) {
             if(queryResults[i].attributes.token_id == queryResultCreateNFT[u].attributes.tokenId) {
                  isFrag = queryResultCreateNFT[u].attributes.isFrag;
                  console.log(isFrag);
                  amountFrag = queryResultCreateNFT[u].attributes.amountFrag;
             }
        }

        results.push({
             "uid": uid,
             "tokenObjectId": queryResults[i].id,
             "tokenId": queryResults[i].attributes.token_id,
             "parentTokendId": queryResultCreateNFT[i].attributes.parentTokenId,
             "tokenAddress": queryResults[i].attributes.token_address,
             "symbol": queryResults[i].attributes.symbol,
             "tokenUri": queryResults[i].attributes.token_uri,
             "name": queryResults[i].attributes.name,
             "isFrag": isFrag,
             "amountFrag": amountFrag
        });
   }
   return results;
});
Moralis.Cloud.beforeSave("ItemsForSale", async (request) => {
  const query = new Moralis.Query("EthNFTOwners");
     
     //So sánh token_address ở bảng EthNFTOwners với tokenAddress ở bảng ItemsForSale
  query.equalTo("token_address", request.object.get('tokenAddress'));
     //So sánh token_id ở bảng EthNFTOwners với tokenId ở bảng ItemsForSale
  query.equalTo("token_id", request.object.get('tokenId'));
  const object = await query.first();
  if (object){
         //request.object.set('approveAddress', '0x68F2A3594b22a727895e253C602516E779437Da9');
      const owner = object.attributes.owner_of;
         const userQuery = new Moralis.Query(Moralis.User);
      userQuery.equalTo("accounts", owner);
         const userObject = await userQuery.first({useMasterKey:true});
         if (userObject){
        request.object.set('user', userObject);
         }
         request.object.set('token', object);
  }
});

Moralis.Cloud.afterSave("FragNFTs", async (request) => {
     const query = new Moralis.Query("CreateNFTs");
  query.equalTo("tokenId", request.object.get('parentTokenId'));  
   const queryResult = await query.first();
     queryResult.set("isFrag", true);
     queryResult.set("amountFrag", request.object.get('amountFrag'));
     await queryResult.save();
     
});

Moralis.Cloud.afterSave("SoldItems", async (request) => {

  const query = new Moralis.Query("ItemsForSale");
  query.equalTo("tokenId", request.object.get('tokenId'));
  const item = await query.first();
  if (item){
    item.destroy({ useMasterKey: true })
  }

});  
Moralis.Cloud.afterSave("NFTTransfer", async (request) => {

  const query = new Moralis.Query("ItemsForSale");
  query.equalTo("tokenId", request.object.get('tokenId'));
  const item = await query.first();
  if (item){
    item.destroy({ useMasterKey: true })
  }

}); 
Moralis.Cloud.afterSave("CancelItems", async (request) => {

  const query = new Moralis.Query("ItemsForSale");
  query.equalTo("tokenId", request.object.get('tokenId'));
  const item = await query.first();
  if (item){
    item.destroy({ useMasterKey: true })
  }

}); 
Moralis.Cloud.define("getItems", async (request) => {
    
  const query = new Moralis.Query("ItemsForSale");
  //query.equalTo("onSale", true);
  query.select("uid","askingPrice","tokenAddress","tokenId", "token.token_uri", "token.symbol","token.owner_of","token.id");

  const queryResults = await query.find();
  const results = [];

  for (let i = 0; i < queryResults.length; ++i) {

    //if (!queryResults[i].attributes.token || !queryResults[i].attributes.user) continue;

    results.push({
      "uid": queryResults[i].attributes.uid,
      "tokenId": queryResults[i].attributes.tokenId,
      "tokenAddress": queryResults[i].attributes.tokenAddress,
      "price": queryResults[i].attributes.askingPrice,

      "symbol": queryResults[i].attributes.token.attributes.symbol,
      "tokenUri": queryResults[i].attributes.token.attributes.token_uri,
      "ownerOf": queryResults[i].attributes.token.attributes.owner_of,
      "tokenObjectId": queryResults[i].attributes.token.id,
    });
  }

  return results;
});

Moralis.Cloud.define("cancelItem", async (request) => {
    
  const query = new Moralis.Query("ItemsForSale");
  query.equalTo("uid", request.params.uid);
  const item = await query.first();
     if (item){
    item.set('confirmed', false);
    await item.save();
  }
     return item
});


