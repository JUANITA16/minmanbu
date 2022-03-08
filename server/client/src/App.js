import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Card, Section } from 'react-materialize'
import { ToastContainer } from 'react-toastify';
import { Home, GenerateSap, NavigationBar ,CreacionCuenta, Error404, Logout } from './views/index'

import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from "@azure/msal-react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { msalConfig, protectedResources, loginRequest } from './config/authConfig';
import React from 'react';

// Configuracion SSO
export const msalInstance = new PublicClientApplication(msalConfig);

const accounts = msalInstance.getAllAccounts();

if(accounts.length > 0) msalInstance.setActiveAccount(accounts[0]);
else msalInstance.loginPopup(loginRequest).catch(e => {
  console.log("Error login ", e);
})

msalInstance.addEventCallback( event => {
  if(event.eventType === EventType.LOGIN_SUCCESS && event.payload.account){
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }

  if(event.eventType === EventType.LOGIN_FAILURE) console.log(JSON.stringify(event));

});

export const getToken = async () => {
  const account = msalInstance.getActiveAccount();

  if(!account) throw Error("No active account");

  const response = await msalInstance.acquireTokenSilent({
    account: account,
    scopes: protectedResources.data.scopes
  })

  return `Bearer ${response.accessToken}`;
}

export default function App() {
  const base = process.env.PUBLIC_URL;

  console.log("Variable de entorno con prueba:",process.env.REACT_APP_BASE_URL_API);
  return (
    <Section className="blue-grey lighten-5 p0">
      <Router>
        <MsalProvider instance={msalInstance}>
          <NavigationBar />
          <Container className='bg-white'>
            <Card className="z-depth-3">
              <AuthenticatedTemplate>
                <Switch>
                  <Route path={base + '/'} exact component={Home} />
                  <Route path={base + '/ui-generate-sap'} exact component={GenerateSap} />
                  <Route path={base + '/ui-crea-cuenta-deposito'} exact component={CreacionCuenta} />
                </Switch>
              </AuthenticatedTemplate>
              <UnauthenticatedTemplate>
                <Logout />
              </UnauthenticatedTemplate>
            </Card>
          </Container>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover />
        </MsalProvider>
      </Router>
    </Section>
  );
}
