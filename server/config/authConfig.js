const authConfig = async() => {
    return { 
        credentials: {
            tenantID: process.env.REACT_APP_TENANTID,
            clientID: process.env.REACT_APP_CLIENTID
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
            massive_cc:{
                path: "/massive/cc",
                methods:[ "POST" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_PRODUCT_CC" ]
            },
            massive_cdt:{
                path: "/massive/cdt",
                methods:[ "POST" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_PRODUCT_CDT" ]
            },
            table:{
                path: "/table",
                methods:[ "GET" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_PRODUCT_CC", "MINMAMBU_ROLE_ADMIN_PRODUCT_CDT" ]
            },
            sap: {
                path: "/sap",
                methods:[ "GET" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            },
            tax_a_prodt: {
                path: "/tax-a-prodt",
                methods:[ "GET","PUT" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            }
        }
    }
}

module.exports = authConfig;