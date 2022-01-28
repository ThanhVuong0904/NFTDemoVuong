import React from 'react'
import { Link, useLocation } from 'react-router-dom'
const mainNav = [
     {
         display: "Create NFT",
         path: "/"
     },
     {
         display: "My NFT",
         path: "/my-nft"
     },
     {
          display: "Market",
          path: "/market-place"
     },
]
export default function Header({account, onLogOut}) {
     return (
          <header className='header'>
               <div className="container">       
                    <div className="header-menu">
                         {
                              mainNav.map((item, index) => (
                                   <div
                                        className='header-menu-item'
                                        key={index}
                                   >
                                        <Link to={item.path}>
                                             <span>{item.display}</span>
                                        </Link>
                                   </div>
                              ))
                         }
                    </div>
                    <h3>Wellcome <span>{account}</span></h3>
                    <div className="header-action">
                         <button className="btn-logout" onClick={onLogOut}>Logout</button>
                    </div>
               </div>
          </header>
     )
}
