import { setErrorTable } from '../helpers/utils';

const axios = require('axios');

export class TablaCuentaService {

    
    url_api = process.env.REACT_APP_BASE_URL_API  

    getDataTable = async (startDate, endDate, consecutivoCargue) => {
        var parametros = ''
        
        if(consecutivoCargue!==''){
            parametros = `/${consecutivoCargue}`
        }else{
            let formattedStartDate =startDate.getFullYear() +'-'+(startDate.getMonth() + 1)  + "-"+ startDate.getDate() 
            let formattedEndDate =endDate.getFullYear() +'-'+(endDate.getMonth() + 1)  + "-"+ endDate.getDate() 
            parametros =  `?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        }

        
        const path = '/minmambu/api/v1/mambu/massiveAccounts/results'+parametros;  //url para consultar tabla de archivos       
        const endpoint = `${this.url_api}${path}`;
        console.log('endpoint-tabla:'+endpoint);
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

export default TablaCuentaService;
