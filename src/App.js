import { useEffect, useContext } from "react";
import { BrowserRouter, Route } from "react-router-dom/cjs/react-router-dom.min";
import Header from "./components/Header";
import { NFTContext } from "./contexts/NFTContext";
import Routes from "./routes/Routes";
function App() {
	const { 
		authenticate, isAuthenticated, user,  
		enableWeb3, account, logout, isWeb3Enabled
	} = useContext(NFTContext);
	// console.log(account, user);
	useEffect(() => {
		if(!isWeb3Enabled) {
			enableWeb3()
		}
	},[])
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
