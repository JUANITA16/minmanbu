import { LogLevel } from "@azure/msal-browser";

const data = {
    tenantID: process.env.REACT_APP_TENANTID,
    clientID: process.env.REACT_APP_CLIENTID,
    scopes: process.env.REACT_APP_SCOPE,
    resource: process.env.REACT_APP_RESOURCE
}
export const msalConfig = {
    auth: {
        clientId: data.clientID, // This is the ONLY mandatory field that you need to supply.
        authority: 'https://login.microsoftonline.com/'+ data.tenantID, // Defaults to "https://login.microsoftonline.com/common"
        redirectUri: process.env.REACT_APP_REDIRECT_URI, // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    },
    cache: {
        cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default: return;
                }
            }
        }
    }
};

export const protectedResources = {
    data: {
        scopes: [ data.resource + "/" + data.scopes ],
    },
};

export const loginRequest = {
    scopes: [...protectedResources.data.scopes]
};