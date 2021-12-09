import { setError } from '../helpers/utils';

const axios = require('axios');

export class MambuService {

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
                return response.data;
            })
            .catch((error) => {
                return setError(error);
            });
    }

    // downloadFile = async (fileName) => {
    //     const path = `/minmambu/api/v1/sap/file/download?object_key=${fileName}`;        
    //     const endpoint = `${this.url_api}${path}`;
    //     console.log(endpoint);
    //     var config = {
    //         method: 'GET',
    //         url: endpoint,
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     };
    //     return await axios(config)
    //         .then((response) => {
    //             return response.data;
    //         })
    //         .catch((error) => {
    //             return setError(error);
    //         });
    // }
}

export default MambuService;
