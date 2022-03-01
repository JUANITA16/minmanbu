const { getSecret } = require('../utils/secret');

const authConfig = async() => {
    let secret = null
    try {
        console.log("Getting secretSSO");
        secret = await getSecret(process.env.SECRET_AUTH);
    }
    catch(err){
        console.log("Error authConfig", err.message);
    }

    return { 
        credentials: {
            tenantID: secret.tenantID,
            clientID: secret.clientID
        },
        metadata: {
            authority: "login.microsoftonline.com",
            discovery: ".well-known/openid-configuration",
            version: "v2.0"
        },
        settings: {
            validateIssuer: true,
            passReqToCallback: false,
            loggingLevel: "info"
        },
        accessMatrix: {
            cargue:{
                path: "/cargue",
                methods:[ "POST"],
                roles:[ "MINMAMBU_ROLE_CUENTES_MASIVAS_CC_DEV", "MINMAMBU_ROLE_CUENTAS_MASIVAS_CDT_DEV", "MINMAMBU_ROLE_ADMINISTRADOR_DEV" ]
            },
            sap: {
                path: "/sap",
                methods:["GET"],
                roles:["MINMAMBU_ROLE_CONTABILIDAD_DEV", "MINMAMBU_ROLE_ADMINISTRADOR_DEV"]
            },
            admin: {
                path: "/logIn",
                methods:["GET"],
                roles:["MINMAMBU_ROLE_ADMINISTRADOR_DEV",  "MINMAMBU_ROLE_CUENTES_MASIVAS_CC_DEV", "MINMAMBU_ROLE_CUENTAS_MASIVAS_CDT_DEV", "MINMAMBU_ROLE_CONTABILIDAD_DEV" ] 
            }
        }
    }
}

module.exports = authConfig;