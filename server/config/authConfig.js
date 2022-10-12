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
            massive_acc:{
                path: "/mambu/",
                methods:[  "GET" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_PRODUCT_CC", "MINMAMBU_ROLE_ADMIN_PRODUCT_CDT" ]
            },
            mass_file : {
                path: "/massive-acount/upload",
                methods:[  "POST" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_PRODUCT_CC", "MINMAMBU_ROLE_ADMIN_PRODUCT_CDT" ]
            },
            sap_files: {
                path: "/files/",
                methods:[ "GET" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            },
            sap: {
                path: "/sap/file/generate",
                methods:[ "GET" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            },
            tax_a_prodt: {
                path: "/taxaprodt",
                methods:[ "GET","PUT", "POST"],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            },
            cosif: {
                path: "/tblCosifAccounting",
                methods:[ "GET","PUT", "POST" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            },
            rates: {
                path: "/rates",
                methods:[ "GET", "POST" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            },
            dailyInterest: {
                path: "/reprocess",
                methods:[ "POST" ],
                roles:[ "MINMAMBU_ROLE_ADMIN", "MINMAMBU_ROLE_ADMIN_FINANCE"]
            },
        }
    }
}

module.exports = authConfig;