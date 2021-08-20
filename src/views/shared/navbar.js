import React, { Component } from "react";
import { Link } from 'react-router-dom'

export class NavBar extends Component {
    state = {
        menu: [
            {
                name: "Home",
                url: "/"
            },
            {
                name: "Sap",
                url: "/generate-sap"
            }
        ]
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper blue-grey lighten-5">
                    <Link to="/" className="brand-logo">
                        <img className="brand-logo-img" src='./logo.png' alt="Btg Pactual" />
                    </Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {this.state.menu.map((menu, i) => {
                            return (
                                <li key={i}>
                                    <Link key={i} className="nav-link txt-gray hoverable" to={menu.url}>{menu.name}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

        );
    }
}

export default NavBar;