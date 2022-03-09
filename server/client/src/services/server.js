import { setError, setErrorTable, convertTZ, addDays } from '../helpers/utils';
import axios from 'axios';
import { getToken } from '../index';

export class ServerAPI {
    base_url = process.env.REACT_APP_SERVER_BASE_PATH

    generateFile = async (from, to) => {
        try{
            const url = this.base_url + "/sap"
            const config = {
                headers: { Authorization: await getToken() },
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
        try{
            const url = this.base_url + "/massive" + (bodyUpload.product === "CDT" ? "/cdt" : "/cc");
            const config = {
                headers: { Authorization: await getToken() },
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

        const start_date = startDate.getFullYear() +'-'+ ("0"+(startDate.getMonth()+1)).slice(-2) + "-"+ ("0" + startDate.getDate()).slice(-2)+"T00:00:00"
        const end_date = endDate.getFullYear() +'-'+("0"+(endDate.getMonth()+1)).slice(-2) + "-"+ ("0" + endDate.getDate()).slice(-2)+"T24:00:00"
        
        try{
            const url = this.base_url + "/table";
            const config = {
                headers: { Authorization: await getToken() },
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
