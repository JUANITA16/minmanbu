const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const bodyparser = require('body-parser');
const path = require("path");
const csrf = require("csurf");
// const hpp = require("hpp");
require('dotenv').config(); // Load environment variables from .env file


const setUp = async() => {
    /* Init express ################################################################### */
    const app = express();

    // cors
    const corsOptions = {
        origin: process.env.URLORIGIN, 
        optionsSuccessStatus: 200 
    }
    app.use(cors(corsOptions));
    //app.use(csrf())
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(bodyparser.json({limit: '6mb'})); // Limite del body que procesa una lambda en AWS
    // app.use(hpp());
    app.use(function (error, req, res, next) {
        if (error instanceof SyntaxError) {
          res.status(400).send("Cuerpo de la petición incorrecto");
        }
    });

    app.use(helmet());
    app.use(helmet.contentSecurityPolicy());
    app.use(
        helmet.hsts({
          maxAge: 31536001,
        })
    );
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                "default-src": ["'none'"],
                "frame-src": ["'self'"],
                "connect-src": ["'self'", "blob:", "https://login.microsoftonline.com/",process.env.URLORIGIN],
                "manifest-src": ["'self'"],
                "object-src": ["'none'"],
                "img-src": ["'self'","data:"],
                "frame-ancestors": ["'self'"],
                "form-action": ["'self'"],
                "base-uri": ["'self'"],
                "script-src": ["'self'", "'unsafe-inline'"],
                "style-src": ["'self'","'unsafe-inline'"],
                blockAllMixedContent: []
            },
        })
    );

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
        console.log("Health Check")
        res.json({ 
            api: "Minmambu front", 
            message: "Health OK!"
        })
    });

    // Import controllers + router
    const router = express.Router();
    const simpleController = require('./controllers/simpleController');

    router.all("/*", simpleController);

    app.use( process.env.SERVER_BASE_PATH,
        passport.authenticate('oauth-bearer', { session: false }),
        routeGuard(authConfig.accessMatrix),
        router
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
        res.status(404).send("Sorry cant find that");
    });

    return app;
}

module.exports = setUp;