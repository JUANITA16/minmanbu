import { setError, convertTZ, addDays } from '../helpers/utils';
import axios from 'axios';
import { getToken } from '../index';

class ServerAPI {
    base_url = process.env.REACT_APP_SERVER_BASE_PATH

    generateSAP = async (from, to,user_name) => {
        try{
            const url = this.base_url + "/sap/file/generate"
            const config = {
                headers: { Authorization: await getToken() },
                params: { from, to,user_name}
            }

            const res = await axios.get(url, config);
            const data = await res.data;
            return data;
        }
        catch(err){
            console.info("ERROR sap:");
            return setError("Error generando el archivo.", err.response);
        }
    }


    uploadFile = async (bodyUpload) => {
        try{
            const url = this.base_url + "/massive-acount/upload";
            const config = {
                headers: { Authorization: await getToken() },
            }
            const body = bodyUpload;

            const res = await axios.post(url, body, config);
            const data = await res.data;
            return data;
        }
        catch(err){
            console.info("Error massive");
            return setError("Error cargando el archivo.", err.response);
        }
    }

    getSapFiles = async (from_date, to_date) => {
        // const url = this.base_url + "/files";
        const url = this.base_url + "/files/"
        const config = {
            headers: { Authorization: await getToken()},
            params: { from_date, to_date }
        }
        const res = await axios.get(url, config);
        const data = await res.data;
        return data
    }

    getSapURL = async (filename) => {
        // const url = this.base_url + "/files";
        const url = this.base_url + "/files/download/" + filename
        const config = {
            headers: { Authorization: await getToken()}
        }
        const res = await axios.get(url, config);
        const data = await res.data;
        return data
    }


    sendUpdateRate = async (update_date,user) => {
        const url = this.base_url + "/rates?update_date=" + update_date+ "&user="+user
        const config = {
            headers: { Authorization: await getToken()}
        }
        const res = await axios.post(url,{},config);
        const data = await res.data;
        return data
    }


    getRatesData = async (initial_date, final_date) => {
        const url = this.base_url + "/rates"
        const config = {
            headers: { Authorization: await getToken()},
            params: {initial_date, final_date}
        }
        const res = await axios.get(url, config);
        const data = await res.data;
        return data
    }


    getDataDetails = async (consecutive) => {

        try{
            const url = this.base_url + "/mambu/massiveAccounts/results/" + consecutive;
            const config = {
                headers: { Authorization: await getToken() }
            }

            const res = await axios.get(url, config);
            const data = await res.data;
            return {
                status: 200,
                data
            };
        }
        catch(err){
            console.info("ERROR Table: ", err.response)
            return setError("Error obteniendo la tabla.", err.response);
        }
    }
    
    getDataTable = async (startDate, endDate, consecutive,isWeek) => {
        if(isWeek){
            startDate = convertTZ(addDays(new Date(),-7))
            endDate = convertTZ(new Date())
        }

        const start_date = startDate.getFullYear() +'-'+ ("0"+(startDate.getMonth()+1)).slice(-2) + "-"+ ("0" + startDate.getDate()).slice(-2)+"T00:00:00"
        const end_date = endDate.getFullYear() +'-'+("0"+(endDate.getMonth()+1)).slice(-2) + "-"+ ("0" + endDate.getDate()).slice(-2)+"T24:00:00"
        
        try{
            const url = this.base_url + "/mambu/massiveAccounts/results";
            const config = {
                headers: { Authorization: await getToken() },
                params: {
                    start_date,
                    end_date
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
            console.info("ERROR Table: ", err.response)
            return setError("Error obteniendo la tabla.", err.response);
        }
    }


    getAllTaxAProdT = async () => {
        
        const url = this.base_url + "/taxaprodt"
        const config = {
            headers: { Authorization: await getToken() },
        }
        const res = await axios.get(url,config)
        
        return res;
    };


    
    
    updateItemConfiguracionGeneral = async (dataToUpdate,idRow) => {
        const url = this.base_url + "/taxaprodt/" + idRow
        
        const config = {
            headers: { Authorization: await getToken() }
        }
        const res = await axios.put(url,dataToUpdate,config)
        
        return res;
    }
    
    
    createItemConfiguracionGeneral = async (dataCreate) => {
        const url = this.base_url + "/taxaprodt"
        
        const config = {
            headers: { Authorization: await getToken() }
        }
        const res = await axios.post(url,dataCreate,config)
      
        return res;
    }

    getAllCosif = async () => {
        
        const url = this.base_url + "/tblCosifAccounting"
        const config = {
            headers: { Authorization: await getToken() }
        }
        const res = await axios.get(url,config)
        
        return res;
    };
    
    updateItemConfiguracionHomologacion = async (dataToUpdate,idRow) => {
        const url = this.base_url + "/tblCosifAccounting/" + idRow

        const config = {
            headers: { Authorization: await getToken() }
        }
        const res = await axios.put(url,dataToUpdate,config)
      
        return res;
    }


    createItemConfiguracionHomologacion = async (dataCreate) => {
        const url = this.base_url + "/tblCosifAccounting"

        const config = {
            headers: { Authorization: await getToken() }
        }
        const res = await axios.post(url,dataCreate,config)
      
        return res;
    }
}

export {ServerAPI} ;
