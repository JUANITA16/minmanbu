import M from "materialize-css/dist/js/materialize.min.js";
import reportWebVitals from './config/reportWebVitals';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import 'materialize-css/dist/css/materialize.min.css'
import 'material-icons/iconfont/filled.css';
import 'material-icons/iconfont/outlined.css';
import './styles/index.css';

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig, protectedResources } from './config/authConfig';
import {encryptText} from './helpers/utils'

// Configuracion SSO
export const msalInstance = new PublicClientApplication(msalConfig);

const accounts = msalInstance.getAllAccounts();

if(accounts.length > 0) msalInstance.setActiveAccount(accounts[0]);

msalInstance.addEventCallback( event => {
  if(event.eventType === EventType.LOGIN_SUCCESS && event.payload.account){
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }

});

export const getToken = async () => {
  const account = msalInstance.getActiveAccount();

  if(!account) throw Error("No active account");

  const response = await msalInstance.acquireTokenSilent({
    account: account,
    scopes: protectedResources.data.scopes
  })
  const tokenEncrypt = await encryptText(response.accessToken);
  return `Bearer ${tokenEncrypt}`;
}

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

document.addEventListener('DomContentLoaded', function () {
  M.AutoInit();
});

reportWebVitals();
