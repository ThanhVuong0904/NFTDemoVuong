const Jimp = require('jimp')
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const axios  = require('axios')
const Moralis = require('moralis/node')
const FormData = require('form-data');
const path = require('path');
const {removeBackgroundFromImageUrl,removeBackgroundFromImageFile} = require("remove.bg")
const app = express()
app.use(express.json())
const Eye1 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494844/NFT/Eyes_Closed1_dgyq6k.png'
const Eye2 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494844/NFT/Eyes_Normal1_z4jqpp.png'
const Eye3 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494843/NFT/Eyes_Sleepy1_zb1oth.png'
const Eye4 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494843/NFT/Eyes_Tears1_mob5qm.png'
const Eye5 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494844/NFT/Eyes_Tears2_vk9orl.png'
const Eye6 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494844/NFT/Eyes_Tears3_gohn9i.png'

const EYE = [
     {id: 1, image: Eye1},
     {id: 2, image: Eye2},
     {id: 3, image: Eye3},
     {id: 4, image: Eye4},
     {id: 5, image: Eye5},
     {id: 6, image: Eye6},
]
const Headdress1 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494862/NFT/Hair-1_niqj1q.png'
const Headdress2 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494862/NFT/Hair-2_r5szf4.png'
const Headdress3 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494862/NFT/Hair-3_hfikz9.png'
const Headdress4 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494862/NFT/Hair-4_scrbi0.png'
const Headdress5 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494862/NFT/Hair-5_ctxlxs.png'

const HEADDRESS = [
     {id: 1, image: Headdress1},
     {id: 2, image: Headdress2},
     {id: 3, image: Headdress3},
     {id: 4, image: Headdress4},
     {id: 5, image: Headdress5},
]

const Phone1 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494882/NFT/Phone-1_upgphk.png'
const Phone2 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494882/NFT/Phone-2_gflsad.png'
const Phone3 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494882/NFT/Phone-3_h5rxue.png'
const Phone4 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494882/NFT/Phone-4_hu2lke.png'
const Phone5 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494882/NFT/Phone-5_eym8kt.png'
const Phone6 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494882/NFT/Phone-6_hboxox.png'

const PHONE = [
     {id: 1, image: Phone1},
     {id: 2, image: Phone2},
     {id: 3, image: Phone3},
     {id: 4, image: Phone4},
     {id: 5, image: Phone5},
     {id: 6, image: Phone6},
]
const Mouth1 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494871/NFT/Mouth-1_ykqixv.png'
const Mouth2 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494871/NFT/Mouth-2_x0z9yx.png'
const Mouth3 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494871/NFT/Mouth-3_dj7zsi.png'
const Mouth4 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494871/NFT/Mouth-4_qe64sk.png'
const Mouth5 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494871/NFT/Mouth-5_xiibap.png'
const MOUTH = [
     {id: 1, image: Mouth1},
     {id: 2, image: Mouth2},
     {id: 3, image: Mouth3},
     {id: 4, image: Mouth4},
     {id: 5, image: Mouth5},
]

const Cloth1 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494912/NFT/0default_wfnjnz.png'
const Cloth2 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494912/NFT/Cloth-1_vguusu.png'
const Cloth3 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494913/NFT/Cloth-2_qbzzmp.png'
const Cloth4 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494912/NFT/Cloth-3_sabq9d.png'
const Cloth5 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494912/NFT/Cloth-4_rsvwfv.png'
const Cloth6 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494912/NFT/Cloth-5_bgqpdp.png'
const Cloth7 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494913/NFT/Cloth-6_j3ryuk.png'

const CLOTHES = [
     {id: 1, image: Cloth1},
     {id: 2, image: Cloth2},
     {id: 3, image: Cloth3},
     {id: 4, image: Cloth4},
     {id: 5, image: Cloth5},
     {id: 6, image: Cloth6},
     {id: 7, image: Cloth7},
]
const Background1 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494912/NFT/0default_wfnjnz.png'
const Background2 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494925/NFT/BG-stuff-1_jb0obu.jpg'
const Background3 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494925/NFT/BG-stuff-2_dw36ws.jpg'
const Background4 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494937/NFT/BG-stuff-3_xe3kxq.jpg'
const Background5 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494925/NFT/BG-stuff-4_mczf8b.jpg'
const Background6 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494928/NFT/BG-stuff-5_nkvx7l.jpg'
const Background7 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494925/NFT/BG-stuff-6_pzdogp.jpg'

const BACKGROUND = [
     {id: 1, image: Background1},
     {id: 2, image: Background2},
     {id: 3, image: Background3},
     {id: 4, image: Background4},
     {id: 5, image: Background5},
     {id: 6, image: Background6},
     {id: 7, image: Background7},
]
const Accessories1 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494912/NFT/0default_wfnjnz.png'
const Accessories2 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494938/NFT/Accessories-1_qn6vci.png'
const Accessories3 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494938/NFT/Accessories-2_kx9gki.png'
const Accessories4 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494938/NFT/Accessories-3_g4bj2h.png'
const Accessories5 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494938/NFT/Accessories-4_nrpxxf.png'
const Accessories6 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494938/NFT/Accessories-5_fss9kj.png'
const Accessories7 = 'https://res.cloudinary.com/debkio0dv/image/upload/v1642494938/NFT/Accessories-6_mp9dzz.png'

const ACCESSORIES = [
     {id: 1, image: Accessories1},
     {id: 2, image: Accessories2},
     {id: 3, image: Accessories3},
     {id: 4, image: Accessories4},
     {id: 5, image: Accessories5},
     {id: 6, image: Accessories6},
     {id: 7, image: Accessories7},
]
const PORT = process.env.PORT || 5000

app.use(cors())

// https://shlprjquhmo7.usemoralis.com
app.post('/composite', async (req, response) => {
     const {result, id, backgroundByUser, mouthByUser} = req.body
     console.log("mouth",mouthByUser);
     console.log("background",backgroundByUser);
     var images = []
     //BACKGROUND
     const backgroundPromise = new Promise((res, rej) => {
          if(backgroundByUser !== undefined) {
               res({image: backgroundByUser})
          }
          res(BACKGROUND.find(item => item.id === result.background))
     })
     images.push(backgroundPromise.then(data => data))
     //EYE
     const eyePromise = new Promise((res, rej) => {
          res(EYE.find(item => item.id === result.eye))
     })
     images.push(eyePromise.then(data => data))

     //HEADDRESS
     const headdressPromise = new Promise((res, rej) => {
          res(HEADDRESS.find(item => item.id === result.headdress))
     })
     images.push(headdressPromise.then(data => data))

     //PHONE
     const phonePromise = new Promise((res, rej) => {
          res(PHONE.find(item => item.id === result.phone))
     })
     images.push(phonePromise.then(data => data))

     //CLOTHES
     const clothesPromise = new Promise((res, rej) => {
          res(CLOTHES.find(item => item.id === result.clothes))
     })
     images.push(clothesPromise.then(data => data))

     //ACCESSORIES
     const accessoriesPromise = new Promise((res, rej) => {
          res(ACCESSORIES.find(item => item.id === result.accessories))
     })
     images.push(accessoriesPromise.then(data => data))

     //MOUTH
     const mouthPromise = new Promise((res, rej) => {
          if(mouthByUser) {
               res({image: './src/final-images/compositeMouthWithBgTransparent.png'})
          }
          res(MOUTH.find(item => item.id === result.mouth))
     })
     images.push(mouthPromise.then(data => data))

     Promise.all(images).then(data => {
          var jimps = []

          console.log("This is ID", id);
          //JimpRead image
          for (var i = 0; i < data.length; i++) {
               jimps.push(Jimp.read(data[i].image));
          }
          
          //Composite image
          Promise.all(jimps).then(function() {
               return Promise.all(jimps);
          }).then(async function(image) {
               // image[0] = background
               // image[1] = eye
               // image[2] = headdress
               // image[3] = phone
               // image[4] = clothes
               // image[5] = ACCESSORIES
               // image[6] = MOUTH
               // console.log(image[6]);
               image[0].resize(1062,1062); //resize background w1062 h1062
               image[0].composite(image[1],0,0);
               image[0].composite(image[2],0,0);
               image[0].composite(image[3],0,0);
               image[0].composite(image[4],0,0);
               image[0].composite(image[5],0,0);
               image[0].composite(image[6],0,0);
               //Write Image
               image[0].write(`./src/final-images/${id}.png`,async (data) => {
                    console.log("Wrote the image final");
                    return response.json({success: true, message: "Composite Image"})
               })
          });
          
     })
})

//Composite Mouth + Background Transparent
app.post('/handleMouthImage', async (req, res) => {
     const {rotate, mouthImage} = req.body
     var posNum = (rotate < 0) ? rotate * -1 : rotate;
     console.log("Xoay", rotate);
     const images = ['./src/final-images/0default.png', mouthImage]
     const jimps = []
     for(var i = 0; i < images.length; i++) {
          jimps.push(Jimp.read(images[i]))
     }
     Promise.all(jimps).then(function() {
          return Promise.all(jimps)
     }).then(image => {
          //0 là background
          //1 là mouth w221 h228
          let heigth = image[1].bitmap.height
          let width = image[1].bitmap.width
          console.log("Width of mouth",width);
          console.log("Height of mouth",heigth);
          if(heigth > 220) {
               image[1].resize(190,width)
          }
          image[1].rotate(Number(posNum))
          image[0].composite(image[1], 600, 600)
          image[0].write(`./src/final-images/compositeMouthWithBgTransparent.png`,async (data) => {
               console.log("Wrote the image mouth");
               return res.json({success: true, message: "handle mouth"})
          })
     })
})
app.post('/removeBackground', async (req, res) => {
     const {mouthByUser} = req.body
     const outputFile = `./src/final-images/no-bg.png`;
     
     removeBackgroundFromImageUrl({
          url: mouthByUser,
          apiKey: "xHtpBHdfwYUdif4k9tgNvQPY",
          size: "regular",
          type: "person",
          outputFile 
     }).then((result) => {
          console.log(`File saved to ${outputFile}`);
          const base64img = result.base64img;
          let promises = [];
          let ipfsArray = []
          promises.push( new Promise( (res, rej) => {
               fs.readFile(outputFile, (err, data) => {
                    if (err) rej()
                    ipfsArray.push({
                         path: `images/no-bg.png`,
                         content: data.toString("base64")
                    })
                    res()
               })
          }) )
          //Push Image to IPFS
          Promise.all(promises).then(() => {
               axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
                    ipfsArray,
                    {
                         headers: {
                              "X-API-KEY": 'k30Du9VUUJbgHG6db8QItgxGryCNwcw0KhZ1tfZz86e1LlabB44y1sMwEwqprYPr',
                              "Content-Type": "application/json",
                              "accept": "application/json"
                         }
                    }
               ).then( (response) => {
                    console.log(response.data);
                    return res.json({
                         success: true, 
                         image: response.data[0].path,
                         message: 'Remove background'
                    })
               })
               .catch ( (error) => {
                    console.log(error)
               })
          })
     }).catch((errors) => {
          console.log(JSON.stringify(errors));
     });

})

app.post('/uploadImage', async (req, res) => {
     const {id} = req.body
     let ipfsArray = [];
     let promises = [];
     promises.push( new Promise( (res, rej) => {
          fs.readFile(`./src/final-images/${id}.png`, (err, data) => {
               if (err) rej()
               ipfsArray.push({
                    path: `images/${id}.png`,
                    content: data.toString("base64")
               })
               res()
          })
     }) )
     //Push Image to IPFS
     Promise.all(promises).then(() => {
          axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
               ipfsArray,
               {
                    headers: {
                         "X-API-KEY": 'k30Du9VUUJbgHG6db8QItgxGryCNwcw0KhZ1tfZz86e1LlabB44y1sMwEwqprYPr',
                         "Content-Type": "application/json",
                         "accept": "application/json"
                    }
               }
          ).then( (response) => {
               console.log(response.data);
               return res.json({success: true, image: response.data[0].path})
          })
          .catch ( (error) => {
               console.log(error)
          })
     })
})
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
