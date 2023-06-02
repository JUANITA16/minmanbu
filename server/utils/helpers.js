const CryptoJs = require("crypto-js");
const { getSecret } = require('./secret');

const decryptText = (mensajeEncriptado) =>{
    var clave = "minmambu-key";
    const bytes = CryptoJs.AES.decrypt(mensajeEncriptado,clave, { mode: CryptoJs.mode.CTR });
    return bytes.toString(CryptoJs.enc.Utf8);
}


module.exports =  decryptText;
