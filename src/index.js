import 'bootstrap/dist/css/bootstrap.min.css';
import { MoralisProvider } from 'react-moralis';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/style.css'
import NTFContextProvider from './contexts/NFTContext'

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider 
      appId='kQJqujThIlZAvRLPNW93pc9kzerMobgBIIN5JVn3' 
      serverUrl='https://shlprjquhmo7.usemoralis.com:2053/server'
    >
      <NTFContextProvider>
        <App />
      </NTFContextProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
