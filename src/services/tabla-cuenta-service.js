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

        let formattedStartDate =startDate.getFullYear() +'-'+ ("0"+(startDate.getMonth()+1)).slice(-2) + "-"+ ("0" + startDate.getDate()).slice(-2)
        let formattedEndDate =endDate.getFullYear() +'-'+("0"+(endDate.getMonth()+1)).slice(-2) + "-"+ ("0" + endDate.getDate()).slice(-2)

        parametros =  `?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        // jsonPrueba = [
        // {
        //     "filename": "Carga masiva de Cuentas Deposito (1)-202201200926536.xlsx",
        //     "results_per_row": [],
        //     "file_id": "202201200926536",
        //     "date_upload": "2022-01-20",
        //     "user_upload": "",
        //     "upload_type": "Cuentas Corrientes",
        //     "original_filename": "Carga masiva de Cuentas Deposito (1).xlsx"
        // },
        // {
        //     "filename": "Resultado_de_carga_masiva_modificacion_nombre_0021-202201191531911.xlsx",
        //     "results_per_row": [],
        //     "file_id": "202201191531911",
        //     "date_upload": "2022-01-19",
        //     "user_upload": "",
        //     "upload_type": "Bonos",
        //     "original_filename": "Resultado_de_carga_masiva_modificacion_nombre_0021.xlsx"
        // },
        // {
        //     "filename": "Resultado_de_carga_masiva_modificacion_04-202201181943430.xlsx",
        //     "results_per_row": [],
        //     "file_id": "202201181943430",
        //     "date_upload": "2022-01-18",
        //     "user_upload": "",
        //     "upload_type": "Bonos",
        //     "original_filename": "Resultado_de_carga_masiva_mofsdfasfasfasfasfasdificacion_nombre_04.xlsx"
        // },
        // {
        //     "filename": "Resultado_de_carga_masiva_modificacion_nombre_03-202201181930259.xlsx",
        //     "file_id": "202201181930259",
        //     "date_upload": "2022-01-18",
        //     "user_upload": "",
        //     "upload_type": "Bonos",
        //     "original_filename": "Resultado_de_carga_masiva_modificacion_nombre_03.xlsx"
        // },
        // {
        //     "filename": "Resultado_de_carga_masiva_modificacion_nombre_0020-202201191520670.xlsx",
        //     "results_per_row": [],
        //     "file_id": "202201191520670",
        //     "date_upload": "2022-01-19",
        //     "user_upload": "",
        //     "upload_type": "Bonos",
        //     "original_filename": "Resultado_de_carga_masiva_modificacion_nombre_0020.xlsx"
        // },
        // {
        //     "filename": "Carga masiva de Cuentas Deposito (5)-202201200918188.xlsx",
        //     "results_per_row": [],
        //     "file_id": "202201200918188",
        //     "date_upload": "2022-01-20",
        //     "user_upload": "",
        //     "upload_type": "CDT",
        //     "original_filename": "Carga masiva de Cuentas Deposito (5).xlsx"
        // },
        // {
        //     "filename": "Carga masiva de Cuentas Deposito-202201200929153.xlsx",
        //     "results_per_row": [],
        //     "file_id": "202201200929153",
        //     "date_upload": "2022-01-20",
        //     "user_upload": "",
        //     "upload_type": "Bonos",
        //     "original_filename": "Carga masiva de Cuentas Deposito.xlsx"
        // },
        // {
        //     "filename": "Carga masiva de Cuentas Deposito (5)-202201201155930.xlsx",
        //     "results_per_row": [],
        //     "file_id": "202201201155930",
        //     "date_upload": "2022-01-20",
        //     "user_upload": "",
        //     "upload_type": "CDT",
        //     "original_filename": "Carga masiva de Cuentas Deposito (5).xlsx"
        // }];

        if(!isWeek && consecutivoCargue!==''){
            parametros = `/${consecutivoCargue}` 
            // jsonPrueba = [
            //     {
            //         "filename": "Resultado_de_carga_masiva_modificacion_04-202201181943430.xlsx",
            //         "results_per_row": [
            //             {
            //                 "detail": "{\"message\": \"Error no found product or invalid id P-ProductCDT- TF\"}",
            //                 "rowId": "3",
            //                 "status": "Error",
            //                 "codeStatus": "400"
            //             },
            //             {
            //                 "detail": "{\"message\": \"Invalid cod Isin\"}",
            //                 "rowId": "1",
            //                 "status": "Error",
            //                 "codeStatus": "400"
            //             },
            //             {
            //                 "detail": "{\"message\": \"Invalid cod Isin\"}",
            //                 "rowId": "2",
            //                 "status": "Error",
            //                 "codeStatus": "400"
            //             },
            //             {
            //                 "detail": "",
            //                 "rowId": "4",
            //                 "status": "OK",
            //                 "codeStatus": "201"
            //             },
            //             {
            //                 "detail": "",
            //                 "rowId": "5",
            //                 "status": "OK",
            //                 "codeStatus": "201"
            //             },
            //             {
            //                 "detail": "",
            //                 "rowId": "0",
            //                 "status": "OK",
            //                 "codeStatus": "201"
            //             }
            //         ],
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
