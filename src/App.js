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
		authenticate, isAuthenticated, user, isInitialized,
		enableWeb3, account, logout, isWeb3Enabled, isAuthenticating, isUnauthenticated
	} = useContext(NFTContext);
	useEffect(() => {
		if (isInitialized) {
			Moralis.initPlugins();
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isAuthenticated && !isWeb3Enabled) {
			enableWeb3();
		}
		// eslint-disable-next-line

	}, [isAuthenticated]);
	useEffect(() => {
		
	}, [account])
	Moralis.onAccountChanged(async (account) => {
		console.log("account change" ,isAuthenticated)
		await Moralis.User.logOut()
		authenticate({ signingMessage: "Moralis Authentication" })
		// if(!isAuthenticated) {
		// }
	});
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
