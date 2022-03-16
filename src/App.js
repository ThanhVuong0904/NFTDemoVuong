import { useEffect, useContext} from "react";
import {Moralis} from 'moralis';
import { BrowserRouter,  } from "react-router-dom/cjs/react-router-dom.min";
import Header from "./components/Header";
import { NFTContext } from "./contexts/NFTContext";
import Routes from "./routes/Routes";
import { useState } from "react";
import axios from "axios";

function App() {
	const { 
		authenticate, isAuthenticated, user, isInitialized, web3Api,
		enableWeb3, account, logout, isWeb3Enabled, isAuthenticating, isUnauthenticated
	} = useContext(NFTContext);
	useEffect(() => {
		if (isInitialized) {
			Moralis.initPlugins();
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		console.log(web3Api);
	}, [web3Api])

	useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled) {
			enableWeb3();
		}
	}, [isAuthenticated]);

	const accountsChanged = async () => {
		console.log("accountsChanged",account);
		console.log("user",user);
		await logout()
	}
	const chainChanged = async (chainId) => {
		console.log("chainChanged",web3Api.provider.networkVersion);
		console.log(chainId);
	}
	if(web3Api.provider) {
		web3Api.provider.on('accountsChanged', accountsChanged);
		web3Api.provider.on("chainChanged",(chainId) => chainChanged(chainId));
	}
	if(!isAuthenticated) {
		return (
			<div>
			  	<button onClick={() => authenticate({ signingMessage: "Moralis Authentication" })}>Authenticate</button>
			</div>
		);
	}

	return (
		<BrowserRouter>
			<Header onLogOut={logout} account={account}/>
			<div id="app">
				<div className="container">
					<Routes />
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
