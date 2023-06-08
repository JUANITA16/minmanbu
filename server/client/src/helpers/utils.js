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
    var oldMessage = message
    try{
        message = message.replace(/'/g,'\"')
        const objMessage = JSON.parse(message)
        var msgObj=''
        objMessage.forEach(obj=>{
            if(obj.hasOwnProperty('update_rate_content')){
                msgObj= 'Tasa de Interés: ' + obj.update_rate_content
                new_message.push(msgObj)
            }else if(obj.hasOwnProperty('state_content')){
                msgObj='Estado Cuenta: ' + obj.state_content
                new_message.push(msgObj)
            }else if(obj.hasOwnProperty('tax_content')){
                msgObj='Impuesto Retención: '+obj.tax_content
                new_message.push(msgObj)
            }else if(obj.hasOwnProperty('iva_content')){
                msgObj='Exento Iva: '+obj.iva_content
                new_message.push(msgObj)
            }else if(obj.hasOwnProperty('gmf_content')){
                msgObj='Exento GMF: '+obj.gmf_content
                new_message.push(msgObj)
            }else if(obj.hasOwnProperty('less_content')){
                msgObj='Consecutivo Less: '+obj.less_content
                new_message.push(msgObj)
            }else if(obj.hasOwnProperty('max_withdrawal_content')){
                msgObj='Monto máximo de retiro: ' + obj.max_withdrawal_content
                new_message.push(msgObj)
            }else if(obj.hasOwnProperty('message')){
                new_message.push(obj.message)
            }
        })
    }catch(error){
        new_message=[]
        new_message.push(oldMessage)
    }
    return new_message
}

export function encryptText(textoOriginal){
    // const crypto = require('crypto');

    // // Clave pública del receptor (proporcionada por el receptor)
    // // const clavePublica = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwhGlE92jTVL9OLhgsbW8\nnCvzLqN+6n5sJIT00Z9U17HcUztJzcA7i56ICWCbMXEBnsdgLAHeBKyyqTDPE2VX\nunovKm8fmqqe2KwopwRNnroDnvfqVug0XR9EMd+/lcFuFcF882gJgEzWC2777NSE\nyqIikeS6LXSdpJTYBRCWU6q47ncYUaVi+or3KxCDEFLYVL8V6kQ09+ZGaWgUtn0V\nEyzmX+SPApCd2p5HrY59imddumC6fegUJy37d+0ZBtipChqpXNqI9eIPq6zjiAxn\nhxlcx51pH+Fizd3Eyou2T0t7/aezOUBrUAPcRhIkoPoo9Wu5rmGuLjM5DcTMjl9n\nEwIDAQAB\n-----END PUBLIC KEY-----"; //process.env.PUBLIC_KEY_ENCRYPT ;

    // const clavePublica =  "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsiq1Hc2zcDBefBy5KH5j\nidg10H7jDkuJ651R9TeX5Kxhbh/G6+Rgvf1y5wcygJxMMl6PAkgj3c1zPxSm1GNe\nX+4MtxDRcREoaL9uyZ4iJegYCMcURb0n5dnSKtRtKf1+ahLLVd5h768CnkP2oaFk\nmIJeraNKblpngM6IOkyWkctZk/szJjR5ulDBeZZJBmz1OkC5nlUEXd8NQwZe6lwW\n56UfuBgJJLFa/vK3XXzyJ40DVkIHdB7yY0h0xXL0SBMexdVtceCL/+LTJqHs7e03\nKn8j0hVHQwUzBqCBXEYiWr5Ggr0aAP2EVqVDRwQd00l2VYJbq9xGw+ZorZPeJ8IK\nFiRw56/K3E/IHRCqE4yIjDCDP/rOrmtXLRnb6FRSpQkJJiplmlgbVrLjLO1RTpk4\nb/69qV3645jgVvSmk0xPsTnj8zPn4uR5oOMJYNQek0503WzCVYiQ+vOJ4whJ5cBZ\ncSu83XHklFEX5dRAG4sFNNutQhvMob0CWCtYikysOsgStY6GQp2gTXSt4Wbul/OJ\nalTcvf4l8HXJdgBrK8nLJImGlrok5JeQ5deZNwW4t/gvef3fQVZXbGDgRtOngmZm\nklgVXUaMHl7ZdgYhGb/9SCXfOXBOcmVPMNGbvLR9ZFxmUqh4E4X49PtzzGcWzsfu\nRGjsbKOirRZDaMV/tM17Zc8CAwEAAQ==\n-----END PUBLIC KEY-----";
    // // Encriptar el mensaje utilizando la clave pública
    // const bufferMensaje = Buffer.from(textoOriginal, 'utf8');
    // const mensajeEncriptado = crypto.publicEncrypt(clavePublica, bufferMensaje);
    // return mensajeEncriptado.toString('base64');

    const CryptoJS = require('crypto-js');
    const clave = "minmambu-key-dev" //process.env.PUBLIC_KEY_ENCRYPT
    const mensajeEncriptadoAES = CryptoJS.AES.encrypt(textoOriginal, clave, { mode: CryptoJS.mode.CTR });
    return mensajeEncriptadoAES.toString();
}
