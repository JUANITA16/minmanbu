import { setErrorTable, showToast } from '../helpers/utils';

const axios = require('axios');

export class TablaResultadoService {

    
    url_api = process.env.REACT_APP_BASE_URL_API  

    getDataTable = async (paginaActual) => {
        const path = `/minmambu/api/v1/sap/file/generate/nroPagina?${paginaActual}`;  //url para consultar tabla de archivos       
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
                
                return setErrorTable(error);
            });
    }
}

export default TablaResultadoService;
