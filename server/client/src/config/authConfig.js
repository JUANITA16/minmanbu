
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
        storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
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