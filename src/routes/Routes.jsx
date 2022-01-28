import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CreateNFT from '../pages/CreateNFT'
import MyNFT from '../pages/MyNFT'
import Marketplace from '../pages/Marketplace'
export default function Routes() {
     return (
     <Switch>
          <Route path='/' exact component={CreateNFT}/>
          <Route path='/my-nft' exact component={MyNFT}/>
          <Route path='/market-place' exact component={Marketplace}/>
     </Switch>
     )
}
