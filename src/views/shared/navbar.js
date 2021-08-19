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
                url: "/generate-sap-file"
            }
        ]
    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-blue bg-soft">
                <div className="container-fluid row">
                    <div className="col-lg-2">
                        <img src='./logo.png' width='110' />
                    </div>
                    <div className="col-lg-10">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="nav navbar-nav">
                                {this.state.menu.map((menu, i) => {
                                    return (
                                        <li className="nav-item" key={i}>
                                            <Link key={i} className="nav-link txt-gray" to={menu.url}>{menu.name}</Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;