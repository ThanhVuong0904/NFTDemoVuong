# NFT Demo

## Setup mạng Rinkeby (Testnet)
1. Chọn mạng Rinkeby

![image](https://user-images.githubusercontent.com/68543789/150730786-73c38b9b-6b21-4668-ba19-eadc66d917f2.png)

2. Nạp 1 ít tiền vào ví từ https://faucets.chain.link/rinkeby?_ga=2.194193700.840943072.1643004605-1693912681.1641270658



## Yêu cầu cài đặt
- Python verson 3.7.0
- `pip install dlib`
- `pip install Flask`
- `pip install Flask-Cors`
- `pip install opencv-python`
- `pip install urllib3`
- `ngrok` https://ngrok.com/

## Run App

Đề chạy dự án cần làm như sau
1. Mở terminal và gõ lệnh

`npm start` 

2. Mở thêm 1 terminal nữa để chạy file `server.js` bằng cách

`node server`

![image](https://user-images.githubusercontent.com/68543789/150733579-7f89c575-87bf-4df2-b885-3b6a06ea9675.png)

3. cd đến folder `FaceSwap1` mở terminal chạy dòng lệnh

`py main.py`

![image](https://user-images.githubusercontent.com/68543789/154924065-d02b102e-b0f8-4546-8a62-d6e85960a8b7.png)


4. Mở file `ngrok.exe` chạy dòng lệnh

`ngrok http 7777`

![image](https://user-images.githubusercontent.com/68543789/154924264-8282a97d-5804-48df-ba51-9e09cb765027.png)

5. Coppy 1 trong 2 đường link

![image](https://user-images.githubusercontent.com/68543789/154924344-16ff1395-c8a6-4af4-94c5-469bdaac97ca.png)

6. Mở file `./src/pages/SwapFace.jsx` và dán đường link đó vào

![image](https://user-images.githubusercontent.com/68543789/154924505-3eb3d710-6426-46c3-93c9-20abd5c3c48f.png)
