import { setErrorTable, convertTZ, addDays  } from '../helpers/utils';

const axios = require('axios');

export class TablaCuentaService {

    
    url_api = process.env.REACT_APP_BASE_URL_API  
    

    getDataTable = async (startDate, endDate, consecutivoCargue,isWeek) => {
        var parametros = ''
        // var jsonPrueba =[]
        // var response = new Object();
        if(isWeek){
            startDate = convertTZ(addDays(new Date(),-7))
            endDate = convertTZ(new Date())
        }

        let formattedStartDate =startDate.getFullYear() +'-'+ ("0"+(startDate.getMonth()+1)).slice(-2) + "-"+ ("0" + startDate.getDate()).slice(-2)+"T00:00:00"
        let formattedEndDate =endDate.getFullYear() +'-'+("0"+(endDate.getMonth()+1)).slice(-2) + "-"+ ("0" + endDate.getDate()).slice(-2)+"T24:00:00"

        parametros =  `?start_date=${formattedStartDate}&end_date=${formattedEndDate}`

        if(!isWeek && consecutivoCargue!==''){
            parametros = `/${consecutivoCargue}` 
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
                console.log('response table: '+response)
                return response;
            })
            .catch((error) => {
                return setErrorTable(error);
            });
        // response.data = jsonPrueba;
        // response.status=200;
        // return response;
        
    }
}

export default TablaCuentaService;
