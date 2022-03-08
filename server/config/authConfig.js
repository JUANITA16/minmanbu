const authConfig = async() => {
    return { 
        credentials: {
            tenantID: process.env.tenant_id,
            clientID: process.env.client_id
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
                methods:[ "POST" ],
                roles:[ "MINMAMBU_ROLE_ADMINISTRADOR_DEV", "MINMAMBU_ROLE_CUENTES_MASIVAS_CC_DEV", "MINMAMBU_ROLE_CUENTAS_MASIVAS_CDT_DEV" ]
            },
            sap: {
                path: "/sap",
                methods:[ "GET" ],
                roles:[ "MINMAMBU_ROLE_ADMINISTRADOR_DEV", "MINMAMBU_ROLE_CONTABILIDAD_DEV"]
            },
            admin: {
                path: "/logIn",
                methods:[ "GET" ],
                roles:[ "MINMAMBU_ROLE_ADMINISTRADOR_DEV",  "MINMAMBU_ROLE_CUENTES_MASIVAS_CC_DEV", "MINMAMBU_ROLE_CUENTAS_MASIVAS_CDT_DEV", "MINMAMBU_ROLE_CONTABILIDAD_DEV" ] 
            }
        }
    }
}

module.exports = authConfig;