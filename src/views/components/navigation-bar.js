import React, { useState } from "react";
import { Navbar, Icon } from 'react-materialize'
import { Link } from "react-router-dom";

export default function NavigationBar() {
    const base = process.env.PUBLIC_URL;

    const [menu] = useState([
        {
            name: "Home",
            url: `${base}/`
        },
        {
            name: "Sap",
            url: `${base}/generate-sap`
        }
    ])

    return (
        <Navbar
            alignLinks="right"
            brand={<Link className="brand-logo" to={base}>
                <img className="brand-logo-img" src='./logo-white.svg' alt="Btg Pactual V2" /></Link>}
            centerChildren
            className="indigo darken-4"
            id="mobile-nav"
            menuIcon={<Icon small>menu</Icon>}
            options={{
                draggable: true,
                edge: 'left',
                inDuration: 250,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                outDuration: 200,
                preventScrolling: true
            }}>
            {menu.map((menu, i) => {
                return <Link key={i} to={menu.url}>{menu.name}</Link>
            })}
        </Navbar>
    );
}
