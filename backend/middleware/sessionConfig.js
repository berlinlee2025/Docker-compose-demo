// rootDir/middleware/sessionConfig.js

const session = require('express-session');
const { isProduction } = require('../util/environment');  // Assume environment settings are managed here

const sessionMiddleware = session({
    secret: 'secret', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction, // Simplified for clarity
        httpOnly: isProduction,
        expires: new Date(Date.now() + 900000),
        maxAge: 900000,
        sameSite: isProduction ? 'None' : 'Lax'
    }
});

module.exports = sessionMiddleware;