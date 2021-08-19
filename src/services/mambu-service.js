const axios = require('axios');
const oauth = require('axios-oauth-client');

export class MambuService {

    url_api = process.env.REACT_APP_URL_API;
    client_id = process.env.REACT_APP_CLIENT_ID;
    client_secret = process.env.REACT_APP_SECRET_ID;
    resource = process.env.REACT_APP_RESOURCE;
    state = {
        token: ""
    }

    getToken = async () => {
        const path = "/dev/auth/token";
        const headers = { 
            'Accept': '*/*', 
            'mode': 'cors',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
        };

        try {
            const getClientCredentials = oauth.client(axios.create(headers), {
                url: path,
                grant_type: 'client_credentials',
                token_type: 'Bearer',
                client_id: this.client_id,
                client_secret: this.client_secret,
                resource: this.resource
            });
            const auth = await getClientCredentials();
            console.log(auth);
        } catch (error) {
            if (error.request)
                console.log(error.request);
            else if (error.response)
                console.log(error.response);
            else if (error.message)
                console.log(error.message);
        }
    }
}

export default MambuService;
