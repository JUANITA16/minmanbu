const CryptoJs = require("crypto-js");


const decryptText = (mensajeEncriptado) =>{
    var clave = "minmambu-key";
    const bytes = CryptoJs.AES.decrypt(mensajeEncriptado,clave, { mode: CryptoJS.mode.CTR });
    return bytes.toString(CryptoJs.enc.Utf8);
}


module.exports =  decryptText;
