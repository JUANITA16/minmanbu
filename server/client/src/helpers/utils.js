import { toast } from 'react-toastify';

export const setError = (msg, error) => {
    const motivo = error.data.message || error.data.error
    return {
        status:  error.status,
        detail: msg + " \n Motivo: " + motivo
    }
}

export const setFormatDate = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
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
    return new Date((typeof date === "string"
        ? new Date(date)
        : date).toISOString("en-ES", { timeZone: 'America/Bogota' }));
}

//Si el parámetro days se envia en negativo se realiza una resta en los días
export function addDays(date, days) {
    date.setDate(date.getDate() + days)
    return date;
}


export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    //Elimina la palabra data
    let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
    //Valida si la cantidad de caracteres no es un múltiplo de 4
    if ((encoded.length % 4) > 0) {
        //Concatena al final de encoded el símbolo de igual "=" las veces que sea necesario
        encoded += '='.repeat(4 - (encoded.length % 4));
    }
    resolve(encoded);
  };
  reader.onerror = error => reject(error);
});

export function convertMessageError(message){
    var new_message=[]
    try{
        message = message.replaceAll('\'','\"')
        const objMessage = JSON.parse(message)
        var statusCode
        var msgObj=''
        objMessage.forEach(obj=>{
            statusCode =obj.status_code 
            statusCode = statusCode.toString()[0]
            if(!(statusCode=='1' || statusCode=='2')){
                if(obj.hasOwnProperty('update_rate_content')){
                    msgObj=obj.update_rate_content
                    new_message.push(msgObj.replace('Error -','Error en Tasa de Interés:'))
                }else if(obj.hasOwnProperty('state_content')){
                    msgObj=obj.state_content
                    new_message.push(msgObj.replace('Error -','Error en Estado Cuenta:'))
                }else if(obj.hasOwnProperty('tax_content')){
                    msgObj=obj.tax_content
                    new_message.push(msgObj.replace('Error -','Error en Impuesto Retención:'))
                }else if(obj.hasOwnProperty('iva_content')){
                    msgObj=obj.iva_content
                    new_message.push(msgObj.replace('Error -','Error en Exento Iva:'))
                }else if(obj.hasOwnProperty('gmf_content')){
                    msgObj=obj.gmf_content
                    new_message.push(msgObj.replace('Error -','Error en Exento GMF:'))
                }else if(obj.hasOwnProperty('less_content')){
                    msgObj=obj.less_content
                    new_message.push(msgObj.replace('Error -','Error en Consecutivo Less:'))
                }else if(obj.hasOwnProperty('max_withdrawal_content')){
                    msgObj=obj.max_withdrawal_content
                    new_message.push(msgObj.replace('Error -','Error en Monto máximo de retiro:'))
                }else if(obj.hasOwnProperty('message')){
                    new_message.push(obj.message)
                }
            }
        })
    }catch(error){
        new_message.push(message)
    }
    return new_message
}