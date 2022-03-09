import { setError, setErrorTable, convertTZ, addDays } from '../helpers/utils';
import axios from 'axios';
import { getToken } from '../index';

export class ServerAPI {
    base_url = process.env.REACT_APP_SERVER_BASE_PATH

    generateFile = async (from, to) => {
        /*
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
        */
        try{
            const url = this.base_url + "/sap"
            const config = {
                Authorization: await getToken(),
                params: { from, to }
            }

            const res = await axios.get(url, config);
            const data = await res.data;
            return data;
        }
        catch(err){
            return setError(err);
        }
    }

    uploadFile = async (bodyUpload) => {
        /*
        const path = `/minmambu/api/v1/massive-acount/upload`;        
        const endpoint =  `${this.url_api}${path}`;
        console.log('endpoint-masivo'+endpoint);
        console.log('bodyUpload'+bodyUpload);
        var config = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
            data: bodyUpload
        };
        return await axios(config)
            .then((response) => {
                console.log("response:"+response)
                return response.data;
            })
            .catch((error) => {
                return setError(error);
            });
        */
        try{
            const url = this.base_url + "/massive" + (bodyUpload.product === "CDT" ? "/cdt" : "/cc");
            const config = {
                Authorization: await getToken()
            }
            const body = bodyUpload;

            const res = await axios.post(url, body, config);
            const data = await res.data;
            return data;
        }
        catch(err){
            return setError(err);
        }
    }

    getDataTable = async (startDate, endDate, consecutive,isWeek) => {
        if(isWeek){
            startDate = convertTZ(addDays(new Date(),-7))
            endDate = convertTZ(new Date())
        }

        const start_date = startDate.getFullYear() +'-'+ ("0"+(startDate.getMonth()+1)).slice(-2) + "-"+ ("0" + startDate.getDate()).slice(-2)
        const end_date = endDate.getFullYear() +'-'+("0"+(endDate.getMonth()+1)).slice(-2) + "-"+ ("0" + endDate.getDate()).slice(-2)
        /*
        var parametros =  `?start_date=${start_date}&end_date=${end_date}`

        if(!isWeek && consecutive!==''){
            parametros = `/${consecutive}` 
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
        */
        try{
            const url = this.base_url + "/table";
            const config = {
                Authorization: await getToken(),
                params: {
                    start_date,
                    end_date,
                    consecutive
                }
            }

            const res = await axios.get(url, config);
            const data = await res.data;
            return {
                status: 200,
                data
            };
        }
        catch(err){
            return setErrorTable(err);
        }
    }

}

export default ServerAPI;
