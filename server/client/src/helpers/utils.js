import { toast } from 'react-toastify';

export const setError = (msg, error) => {
    const motivo = error.data.message || error.data.error;
    return {
        status:  error.status,
        detail: msg + " \n Motivo: " + motivo
    };
}

const MILLISECONDS_IN_MINUTE = 60000;
export const setFormatDate = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * MILLISECONDS_IN_MINUTE))
        .toISOString("en-ES", { timeZone: 'America/Bogota' })
        .split("T")[0];
}

export const showToast = (message) => {
    toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    });
}

export function convertTZ(date) {
    const dateObj = typeof date === "string"
        ? new Date(date): date;
    return new Date(dateObj.toISOString("en-ES", { timeZone: 'America/Bogota' }));
}

//Si el parámetro days se envia en negativo se realiza una resta en los días
export function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

const BASE64_PADDING_CHAR = '=';
const BASE64_PADDING_LENGTH = 4;

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        //Elimina la palabra data
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        //Valida si la cantidad de caracteres no es un múltiplo de 4
        if ((encoded.length % BASE64_PADDING_LENGTH) > 0) {
            //Concatena al final de encoded el símbolo de igual "=" las veces que sea necesario
            encoded += BASE64_PADDING_CHAR.repeat(BASE64_PADDING_LENGTH - (encoded.length % BASE64_PADDING_LENGTH));
        }
        resolve(encoded);
    };
    reader.onerror = error => reject(error);
});

export function convertMessageError(message){
    const new_message = []
    const oldMessage = message
    try{
        message = message.replace(/'/g,'\"')
        const objMessage = JSON.parse(message)
        let msgObj=''
        objMessage.forEach(obj=>{
            if(obj.hasOwnProperty('update_rate_content')){
                msgObj= 'Tasa de Interés: ' + obj.update_rate_content;
                new_message.push(msgObj);
            }else if(obj.hasOwnProperty('state_content')){
                msgObj='Estado Cuenta: ' + obj.state_content;
                new_message.push(msgObj);
            }else if(obj.hasOwnProperty('tax_content')){
                msgObj='Impuesto Retención: '+obj.tax_content;
                new_message.push(msgObj);
            }else if(obj.hasOwnProperty('iva_content')){
                msgObj='Exento Iva: '+obj.iva_content;
                new_message.push(msgObj);
            }else if(obj.hasOwnProperty('gmf_content')){
                msgObj='Exento GMF: '+obj.gmf_content;
                new_message.push(msgObj);
            }else if(obj.hasOwnProperty('less_content')){
                msgObj='Consecutivo Less: '+obj.less_content;
                new_message.push(msgObj);
            }else if(obj.hasOwnProperty('max_withdrawal_content')){
                msgObj='Monto máximo de retiro: ' + obj.max_withdrawal_content;
                new_message.push(msgObj);
            }else if(obj.hasOwnProperty('message')){
                new_message.push(obj.message);
            }
        })
    }catch(error){
        new_message=[]
        new_message.push(oldMessage)
    }
    return new_message;
}