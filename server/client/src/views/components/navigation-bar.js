import React, { useState } from "react";
import { Navbar, Icon } from 'react-materialize'
import { Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from "@mui/material";
import { useMsal } from "@azure/msal-react";

export default function NavigationBar() {
    const base = process.env.PUBLIC_URL;
    const { instance } = useMsal();
    let homeAccountId = instance.getActiveAccount()?.homeAccountId
    const [menu] = useState([
        {
            name: "Home",
            url: `${base}/`
        },
        {
            name: "Archivo SAP",
            url: `${base}/ui-generate-sap`
        },
        {
            name: "Creación masiva",
            url: `${base}/ui-crea-cuenta-deposito`
        },
        {
            name: "Configuración contable",
            url: `${base}/ui-configuracion-contable`
        },
        {
            name: "Actualización tasas",
            url: `${base}/ui-actualizacion-tasas`
        },
        {
            name: "Generación contabilidad Dominus",
            url: `${base}/generacion-contabilidad`
        }
    ])

    const handleLogout = function (event) {
        const logoutRequest = {
            account: instance.getAccountByHomeId(homeAccountId),
            postLogoutRedirectUri: process.env.REACT_APP_REDIRECT_URI
        }
        instance.logoutRedirect(logoutRequest).catch((e)=>console.error(e))
    }

    const handleClick = function (menuUrl) {
        if (window.location.pathname == menuUrl) {
            window.location.reload()
        }
    }

    return (
        <Navbar
            alignLinks="right"
            brand={<Link className="brand-logo" to={base}>
                <img className="brand-logo-img" src='./logo-white.svg' alt="Btg Pactual" /></Link>}
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
                return <Link key={i} to={menu.url} onClick={()=>{handleClick(menu.url)}}>{menu.name}</Link>
            })}
            <IconButton onClick={handleLogout}>
                <LogoutIcon sx={{color: "white"}}/>
            </IconButton>
        </Navbar>
        
    );
}
