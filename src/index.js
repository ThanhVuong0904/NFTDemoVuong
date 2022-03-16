import 'bootstrap/dist/css/bootstrap.min.css';
import { MoralisProvider } from 'react-moralis';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/style.css'
import 'react-toastify/dist/ReactToastify.css';
import NTFContextProvider from './contexts/NFTContext'
import AvatartNFTContextProvider from './contexts/AvatarNFTContext'
ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider 
      appId='HAt228GcLgvnI0KgJEmOveGba3ZG5bNsGAdpaKcC' 
      serverUrl='https://cgemtoilkcy1.usemoralis.com:2053/server'
    >
      <NTFContextProvider>
        <AvatartNFTContextProvider>
          <App />
        </AvatartNFTContextProvider>
      </NTFContextProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
