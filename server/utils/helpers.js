const crypto = require('crypto');
const { getSecret } = require('./secret');

const decryptText = async (mensaje) =>{
    //var clave = "minmambu-key";
    const clavePrivada = await getSecret(process.env.SECRET_ENCRYPT); 
    console.log('clave-desencriptar: '+clavePrivada)
    const mensajeEncriptado = Buffer.from(mensaje, 'base64');

    // Desencriptar el mensaje utilizando la clave privada
    const bufferMensajeDesencriptado = crypto.privateDecrypt({
        key: clavePrivada
    }, mensajeEncriptado);

    return bufferMensajeDesencriptado.toString('utf8');

}


module.exports =  decryptText;
