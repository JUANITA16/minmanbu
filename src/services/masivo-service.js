import { setError } from '../helpers/utils';

const axios = require('axios');

export class MasivoService {

    url_api = process.env.REACT_APP_BASE_URL_API  

    generateFile = async (startDate, endDate) => {
        const path = `/minmambu/api/v1/sap/file/generate?from=${startDate}&to=${endDate}`;        
        const endpoint = `${this.url_api}${path}`;
        console.log(endpoint);
        var config = {
            method: 'GET',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return await axios(config)
            .then((response) => {
                console.log("response:"+response)
                return response.data;
            })
            .catch((error) => {
                return setError(error);
            });
    }
}

export default MasivoService;
