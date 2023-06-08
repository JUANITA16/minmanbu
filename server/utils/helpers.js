const CryptoJs = require('crypto-js');
const { getSecret } = require('./secret');

const decryptText = async (mensajeEncriptado) =>{
    //var clave = "minmambu-key";
    const clave = await getSecret(process.env.SECRET_ENCRYPT); 
    // const mensajeEncriptado = Buffer.from(mensaje, 'base64');

    // // Desencriptar el mensaje utilizando la clave privada
    // const bufferMensajeDesencriptado = crypto.privateDecrypt({
    //     key: clavePrivada
    // }, mensajeEncriptado);

    // return bufferMensajeDesencriptado.toString('utf8');
    const bytes = CryptoJs.AES.decrypt(mensajeEncriptado,clave, { mode: CryptoJs.mode.CTR });
    return bytes.toString(CryptoJs.enc.Utf8);
}


module.exports =  decryptText;
