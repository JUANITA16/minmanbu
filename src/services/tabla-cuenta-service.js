import { setErrorTable, convertTZ, addDays  } from '../helpers/utils';

const axios = require('axios');

export class TablaCuentaService {

    
    url_api = process.env.REACT_APP_BASE_URL_API  
    

    getDataTable = async (startDate, endDate, consecutivoCargue,isWeek) => {
        var parametros = ''
        // var jsonPrueba =[]
        if(isWeek){
            startDate = convertTZ(addDays(new Date(),-7))
            endDate = convertTZ(new Date())
        }

        let formattedStartDate =startDate.getFullYear() +'-'+ ("0"+(startDate.getMonth()+1)).slice(-2) + "-"+ ("0" + startDate.getDate()).slice(-2)
        let formattedEndDate =endDate.getFullYear() +'-'+("0"+(endDate.getMonth()+1)).slice(-2) + "-"+ ("0" + endDate.getDate()).slice(-2)

        parametros =  `?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        // jsonPrueba = [];

        if(!isWeek && consecutivoCargue!==''){
            parametros = `/${consecutivoCargue}` 
            // jsonPrueba = [
            //     {
            //         "filename": "Resultado_de_carga_masiva_modificacion_04-202201181943430.xlsx",
            //         "results_per_row": [],
            //         "file_id": "202201181943430",
            //         "date_upload": "2022-01-18",
            //         "user_upload": "",
            //         "upload_type": "Bonos",
            //         "original_filename": "Resultado_de_carga_masiva_mofsdfasfasfasfasfasdificacion_nombre_04.xlsx"
            //     }
            // ];
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
                return response.data;
            })
            .catch((error) => {
                
                return setErrorTable(error);
            });
        
        // return jsonPrueba;
        
    }
}

export default TablaCuentaService;
