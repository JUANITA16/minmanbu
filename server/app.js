const express = require("express");
const cors = require("cors");
const bodyparser = require('body-parser');
const path = require("path");
require('dotenv').config(); // Load environment variables from .env file


const setUp = async() => {
    /* Init express ################################################################### */
    const app = express();

    // cors
    const corsOptions = {
        origin: '*', // Reemplazar con dominio
        optionsSuccessStatus: 200 
    }
    app.use(cors(corsOptions));
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(bodyparser.json());
    
    app.disable('x-powered-by');
    app.disable('server');

    /* SSO ############################################################################ */
    const passport = require('passport');
    const BearerStrategy = require('passport-azure-ad').BearerStrategy;

    const getAuthConfig = require('./config/authConfig');
    const authConfig = await getAuthConfig();

    const routeGuard = require('./middleware/validateAuth');

    // Config for SSO
    const options = {
        identityMetadata: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
        issuer: `https://${authConfig.metadata.authority}/${authConfig.credentials.tenantID}/${authConfig.metadata.version}`,
        clientID: authConfig.credentials.clientID,
        audience: authConfig.credentials.clientID, // audience is this application
        validateIssuer: authConfig.settings.validateIssuer,
        passReqToCallback: authConfig.settings.passReqToCallback,
        loggingLevel: authConfig.settings.loggingLevel,
    };
    const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Send user info using the second argument
        done(null, {}, token);
    });

    // Add SSO express
    app.use(passport.initialize());
    passport.use(bearerStrategy);

    /* SERVER SIDE ####################################################################### */
    // - To health check endpoint
    app.get( process.env.SERVER_BASE_PATH + "/healthCheck", async (req, res) => {
        res.json({ 
            api: "Minmambu front", 
            message: "Health OK!"
        })
    });

    // Import routes
    const sapRoute = require('./routes/sap');
    const tableRoute = require('./routes/table');
    const massiveCCRoute = require('./routes/massive-cc');
    const massiveCDTRoute = require('./routes/massive-cdt');
    const taxAprodTRoute = require('./routes/tax-a-prodt');
    const taxAprodTPutRoute = require('./routes/tax-a-prodt-put');


    // - To call backapp.use( process.env.SERVER_BASE_PATH,
    app.use( process.env.SERVER_BASE_PATH,
        passport.authenticate('oauth-bearer', { session: false }),
        routeGuard(authConfig.accessMatrix),
        sapRoute
    );
    app.use( process.env.SERVER_BASE_PATH,
        passport.authenticate('oauth-bearer', { session: false }),
        routeGuard(authConfig.accessMatrix),
        tableRoute
    );
    app.use( process.env.SERVER_BASE_PATH,
        passport.authenticate('oauth-bearer', { session: false }),
        routeGuard(authConfig.accessMatrix),
        massiveCCRoute
    );
    app.use( process.env.SERVER_BASE_PATH,
        passport.authenticate('oauth-bearer', { session: false }),
        routeGuard(authConfig.accessMatrix),
        massiveCDTRoute
    );

    app.use( process.env.SERVER_BASE_PATH,
        passport.authenticate('oauth-bearer', { session: false }),
        routeGuard(authConfig.accessMatrix),
        taxAprodTRoute
    );

    app.use( process.env.SERVER_BASE_PATH,
        passport.authenticate('oauth-bearer', { session: false }),
        routeGuard(authConfig.accessMatrix),
        taxAprodTPutRoute
    );

    /* CLIENT SIDE ################################################################## */
    // Pick up static files of React
    app.use( process.env.CLIENT_BASE_PATH, express.static(path.join(__dirname, "./client/build")));

    // - To front and pick up index
    app.get( process.env.CLIENT_BASE_PATH + "*", (req, res) => {
        res.sendFile(
        path.join(__dirname, "./client/build/index.html")
        );
    });

    // - To route no found
    app.use((req, res, next) => {
        console.log("Ruta no encontrada: ", req.path);
        res.status(404).send("Sorry cant find that");
    });

    return app;
}

module.exports = setUp;