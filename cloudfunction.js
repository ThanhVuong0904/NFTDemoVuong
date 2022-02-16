Moralis.Cloud.afterSave("ItemsForSale", async (request) => {
     const query = new Moralis.Query("ItemsForSale");
          query.equalTo("tokenAddress", request.object.get('tokenAddress'));
          query.equalTo("tokenId", request.object.get('tokenId'));
          const item = await query.first();
          if(item) {
            return await item.destroy({ useMasterKey: true });
       }
   });