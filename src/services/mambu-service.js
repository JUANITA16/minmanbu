const axios = require('axios');

export class MambuService {

    urlBase = process.env.URL_BASE;
    CLIENT_ID = process.env.CLIENT_ID;
    SECRET_ID = process.env.SECRET_ID;
    RESOURCE = process.env.RESOURCE;
    state = {
        token: ""
    }

    getToken = async () => {
        const path = "/dev/auth/token";
        const endpoint = `${this.urlBase}${path}`;

        const params = new URLSearchParams();
        params.append('client_id', this.MY_CLIENT_ID);
        params.append('client_secret', this.MY_SECRET_ID);
        params.append('resource', this.RESOURCE);
        params.append('grant_type', 'client_credentials');
        params.append('token_type', 'Bearer');

        const headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        };

        await axios.post(endpoint, params, headers)
            .then((result) => {
                if (result) {
                    this.setState({ token: result.access_token });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export default MambuService;
