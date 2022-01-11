import { setErrorTable } from '../helpers/utils';

const axios = require('axios');

export class TablaCuentaService {

    
    url_api = process.env.REACT_APP_BASE_URL_API  

    getDataTable = async (paginaActual, cantPaginasSelect, startDate,endDate, consecutivoCargue, tipoConsulta, isMain, id) => {
        var parametros =  `nroPagina?${paginaActual}&cantRegistros?${cantPaginasSelect}`;
        if(isMain===true){
            if(tipoConsulta==='filtro'){
                if(consecutivoCargue!==''){
                    parametros = parametros + `&consecutivoCargue?${consecutivoCargue}`;
                }else{
                    let formattedStartDate =startDate.getFullYear() +'-'+(startDate.getMonth() + 1)  + "-"+ startDate.getDate() 
                        let formattedEndDate =endDate.getFullYear() +'-'+(endDate.getMonth() + 1)  + "-"+ endDate.getDate() 
                    parametros = parametros + `&startDate?${formattedStartDate}&endDate?${formattedEndDate}`;
                }
            }
            
        }else{
            parametros=`id?${id}&`+parametros;
        }
        
        
        const path = '/minmambu/api/v1/sap/file/generate/'+parametros;  //url para consultar tabla de archivos       
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
