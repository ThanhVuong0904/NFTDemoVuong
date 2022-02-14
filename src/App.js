import { useEffect, useContext, useMemo} from "react";
import {Moralis} from 'moralis';
import { BrowserRouter,  } from "react-router-dom/cjs/react-router-dom.min";
import Header from "./components/Header";
import { NFTContext } from "./contexts/NFTContext";
import Routes from "./routes/Routes";
function App() {
	const { 
		authenticate, isAuthenticated, user, isInitialized,
		enableWeb3, account, logout, isWeb3Enabled
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
