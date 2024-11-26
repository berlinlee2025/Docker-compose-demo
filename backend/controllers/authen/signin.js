const rootDir = require('../../util/path');
require('dotenv').config({ path: `${rootDir}/.env`});
const { printDateTime } = require('../../util/printDateTime');

const { validationResult } = require('express-validator');
const HttpError = require('../../models/http-error');

const db = require('../../util/database');
// const bcrypt = require('bcrypt-nodejs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// create http://localhost:3001/api/user/signin route
exports.handleSignin = (req, res, next) => {
    printDateTime();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    
    const { email, password } = req.body;
    
    const callbackName = `handleSignin`;
    console.log(`\nJust received an HTTP request for:\n${callbackName}\n`);

    // Server-side validations
    // If there're no req.body.email OR req.body.password
    if (!email || !password) {
        return res.status(422).json({
            sucess: false,
            status: { code: 422 },
            message: `Email & password must be provided!`
        })
    }

    db
    .select('email', 'hash')
    .where('email', '=', email)
    .from('login')
    .then((response) => {

        // Check if the response is empty
        if (response.length === 0) {
            return res.status(401).json({
                success: false,
                status: { code: 401 },
                message: 'Email does not exist.'
            });
        }

        // Comparing users' password input from req.body.password
        // to server-side fetched json
        const isValid = bcrypt.compareSync(password, response[0].hash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                status: { code: 401 },
                message: `Authentication failed`
            })
        }

        // If they match up
        // return SELECT * FROM users WHERE email = req.body.email;
        // Will give a user json object
        db.select('*').from('users').where('email', '=', email)
        .then((users) => {

            if (users.length === 0) {
                throw new HttpError('User not found', 404);
            }

            // userData = { id: number, name: string, email: string, entries: number, joined: string}
            const userData = users[0];

            console.log(`userData: `, userData, `\n`);
            
            let token;
            // jwt.sign((string | object | Buffer), jwtKey, options{});
            
            token = jwt.sign({
                id: userData.id, // encoding id
                name: userData.name, // encoding name
                email: userData.email, // encoding email
                entries: userData.entries, // encoding entries
                joined: userData.joined // encoding joined
            }, process.env.JWT_SECRET,
            { 
                expiresIn: '1h' 
            }
            );

            return res.status(201).json({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                entries: userData.entries,
                joined: userData.joined,
                token: token
            });

        })
        .catch((err) => {
            if (err instanceof HttpError) {
                return res.status(401).json({
                    success: false,
                    status: { code: 401 },
                    message: `Error during Login: ${err.message}`
                });
            } else {
                console.error(`Error during sign in: ${err}`);
                return res.status(500).json({
                    success: false,
                    status: { code: 500 },
                    message: `Server Internal Error during Login`
                })
            }
        });
    })
    .catch((err) => {
        if (err instanceof HttpError) {
            console.error(`\nError during Login:\n`, err, `\n`);

            return res.status(401).json({
                success: false,
                status: { code: 401 },
                message: `Error during Login`
            });
        } else {
            console.error(`Error during sign in:\n`, err, `\n`);

            return res.status(500).json({
                success: false,
                status: { code: 500 },
                message: `Server Internal Error during Login: ${err.message}`
            })
        }
    });
};
