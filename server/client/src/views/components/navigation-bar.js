import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Typography, Box, Menu, Toolbar,
  Container,
  ThemeProvider,
  createTheme,  } from "@mui/material";
import { useMsal } from "@azure/msal-react";

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const mainTheme = createTheme({
  palette: {
    primary: {
      main: '#001E62',
    },
  },
});
const NavigationBar = () => {
  const { instance } = useMsal();
  const homeAccountId = instance.getActiveAccount()?.homeAccountId;
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const base = process.env.PUBLIC_URL;

  const menu = [
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
    }
    // {
    //     name: "Generación contabilidad Dominus",
    //     url: `${base}/generacion-contabilidad`
    // }
  ]

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleLogout =(_event)=> {
    const logoutRequest = {
      account: instance.getAccountByHomeId(homeAccountId),
      postLogoutRedirectUri: process.env.REACT_APP_REDIRECT_URI
    };
    instance.logoutRedirect(logoutRequest).catch((e) => {
      console.error(e);
    });
  };
  const handleClick =  (menuUrl)=> {
    if (window.location.pathname === menuUrl) {
      window.location.reload();
    }
  };

  return (
    <ThemeProvider theme={mainTheme}>
      <AppBar position="static" color="primary" >
        <Container maxWidth="xl" >
          <Toolbar disableGutters>
            <img className="brand-logo-img" src='./logo-white.svg' alt="Btg Pactual" />

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: "flex-end" }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {menu.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
              <IconButton onClick={handleLogout}>
                <LogoutIcon sx={{color: "white"}}/>
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "flex-end" }}>
              {menu.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => {handleClick(page.url)}}
                  href={page.url}
                  sx={{ my: 2, color: 'white', display: 'block', fontFamily: '"Segoe UI"',
                    textTransform: 'none' }}
                >
                  {page.name}
                </Button>
              ))}
              <IconButton onClick={handleLogout}>
                <LogoutIcon sx={{color: "white"}}/>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};
export default NavigationBar;
{/* <img className="brand-logo-img" src='./logo-white.svg' alt="Btg Pactual" /> */}