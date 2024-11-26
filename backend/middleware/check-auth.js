const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const rootDir = require('../util/path');
require('dotenv').config({ path: `${rootDir}/.env`});

module.exports = (req, res, next) => {
    /* Frontend Browser sends 'OPTIONS' requests before any 'POST' requests */
    if (req.method === 'OPTIONS') {
        console.log(`\nFrontned Browser is traversing from 'OPTIONS' to 'POST'\n`);
        return next();
    }

    try {
        /* key-value = 'Bearer TOKEN' */
        if (!req.headers.authorization) {
            console.error(`\nMissing req.headers.authorization:\n`, req.headers.authorization, `\n`);

            return res.status(401).json({ success: false, status: { code: 401 }, message: `Authorization header is missing.` })
        }

        // Attempt to extract the token from the Authorization header
        const parts = req.headers.authorization.split(' '); // 'Bearer TOKEN'

        console.log(`\nThe PARTS for\n'Bearer [TOKEN]':\n${parts}\n`);

        console.log(`\nBearer:\nparts[0]:\n${parts[0]}\n`);

        console.log(`\nTOKEN:\nparts[1]:\n${parts[1]}\n`);

        const token = parts[1]; // TOKEN
        
        if (!token) {
            console.error(`\nTOKEN is missing\n${token}\n`);

            return res.status(401).json({
                success: false,
                status: { code: 401 },
                message: `Authentication failed`
            });
        }

        /* Verifying JWT Token => return (string | object) */

        /* Recalling how we sign a token for 'signup'
        token = jwt.sign( { userId: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' } ) */

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.userData = { userId: decodedToken.id };

        console.log(`\nJWT req.userData.userId: `, req.userData.userId, `\n`);

        next();

    } catch (err) {
        console.error(`\nFailed to retrieve JWT Token for Authentication\nError: ${err}\n`);
        return res.status(401).json({
            success: false,
            status: { code: 401 },
            message: `Authentication failed`
        })
    }
};