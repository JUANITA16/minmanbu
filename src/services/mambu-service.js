import { setError } from '../helpers/utils';

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
        const endpoint = `${this.url_api}${path}`;
        const headers = {
            'Accept': '*/*',
            'mode': 'cors',
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
        };

        try {
            const getClientCredentials = oauth.client(axios.create(headers), {
                url: endpoint,
                grant_type: 'client_credentials',
                token_type: 'Bearer',
                client_id: this.client_id,
                client_secret: this.client_secret,
                resource: this.resource
            });
            const auth = await getClientCredentials();
            console.log(auth);
        } catch (error) {
            return setError(error);
        }
    }

    generateFile = async (startDate, endDate) => {
        const path = `/dev/mambu/api/v1/accountings-SAP?from=${startDate}&to=${endDate}`;
        var config = {
            method: 'POST',
            url: path,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return await axios(config)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                return setError(error);
            });
    }
}

export default MambuService;
