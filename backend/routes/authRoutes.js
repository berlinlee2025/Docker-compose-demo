const express = require('express');
const { check } = require('express-validator');

/* Import our records controllers */
const registerController = require('../controllers/authen/register');
const rootController = require('../controllers/authen/root');
const signinController = require('../controllers/authen/signin');

/* Calling Router from express.Router() method
router is a pluggable mini-Express app */
const router = express.Router();

/* Adding a Filter '/records' before all Express routes below
in rootDir/server.js */

/* Registering http://localhost:3001/api/user/register
=> Express Router POST request handler */
router.post( // const { email, name, password } = req.body;
    '/register', 
    [
        check('name').not().isEmpty().withMessage(`Name is required`)
        .isLength({ max: 30 }).withMessage(`Name must not be longer than 30 characters`),
        check('email').normalizeEmail().isEmail()
        .withMessage(`Invalid email format`)
        .isLength({ max: 50 }).withMessage(`Email must be no longer than 50 characters`)
        .matches(/^[\w\.-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}$/)
        .withMessage('Email must contain only letters, numbers, periods, hyphens, and must have an "@" symbol'),
        check('password').isLength({ min: 12 }).withMessage(`Password must be >= 12 characters`)
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/) // at least 1 uppercase & 1 special character
        .withMessage(`Password must include at least one uppercase letter, one number, and one special character`)
    ], 
    registerController.handleRegister
);

/* Registering http://localhost:3001/
=> Express Router GET request handler */
router.get('/', rootController.handleRoot);

/* Registering http://localhost:3001/api/user/signin
=> Express Router POST request handler */
router.post( // const { email, password } = req.body;
    '/signin', 
    [
        check('email').normalizeEmail().isEmail()
        .withMessage(`Invalid email format`)
        .isLength({ max: 50 }).withMessage(`Email must be no longer than 50 characters`)
        .matches(/^[\w\.-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}$/)
        .withMessage('Email must contain only letters, numbers, periods, hyphens, and must have an "@" symbol'),
        check('password').isLength({ min: 12 }).withMessage(`Password must be >= 12 characters`)
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/) // at least 1 uppercase & 1 special character
        .withMessage(`Password must include at least one uppercase letter, one number, and one special character`)
    ],
    signinController.handleSignin);

/* Registering http://localhost:3001/signout
=> Express Router POST request handler */

module.exports = router;

