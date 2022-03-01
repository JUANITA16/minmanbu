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
}

module.exports = setUp;