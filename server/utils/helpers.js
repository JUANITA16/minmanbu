const CryptoJs = require("crypto-js");
const { getSecret } = require('./secret');

const decryptText = async (mensajeEncriptado) =>{
    //var clave = "minmambu-key";
    const clave = await getSecret(process.env.SECRET_ENCRYPT); // ApiKey para consumir lambdas
    console.log('clave-desencriptar: '+clave)
    const bytes = CryptoJs.AES.decrypt(mensajeEncriptado,clave, { mode: CryptoJs.mode.CTR });
    return bytes.toString(CryptoJs.enc.Utf8);
}


module.exports =  decryptText;
