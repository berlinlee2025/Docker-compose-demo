const express = require('express');
const { check } = require('express-validator');

/* Import our records controllers */
const imageController = require('../controllers/image');

const checkAuth = require('../middleware/check-auth');

/* Calling Router from express.Router() method
router is a pluggable mini-Express app */
const router = express.Router();

/** Adding a Bearer to all routes below this Middleware */
router.use(checkAuth);

/* Registering http://localhost:3001/image
=> Express Router POST request handler */
router.put( // const { id } = req.body;
    '/image', 
    [
        check('id').not().isEmpty().withMessage(`ID is required`)
        .isInt({ max: 500 }).withMessage(`ID must be <= 500`)
    ],
    imageController.handleImage
);

/* Registering http://localhost:3001/celebrity-image
=> Express Router POST request handler */
router.post( // const input = req.body.input;
    '/celebrity-image', 
    [
        check('input').not().isEmpty().withMessage(`ImageUrl is required`)
        .matches(/^(http|https):\/\/.*/).withMessage(`Input must start with http:// or https://`)
    ],
    imageController.handleCelebrityApi
);

/* Registering http://localhost:3001/color-image
=> Express Router POST request handler */
router.post( // const input = req.body.input;
    '/color-image', 
    [
        check('input').not().isEmpty().withMessage(`ImageUrl is required`)
        .matches(/^(http|https):\/\/.*/).withMessage(`Input must start with http:// or https://`)
    ],
    imageController.handleColorApi
);

/* Registering http://localhost:3001/age-image
=> Express Router POST request handler */
router.post( // const input = req.body.input;
    '/age-image', 
    [
        check('input').not().isEmpty().withMessage(`ImageUrl is required`)
        .matches(/^(http|https):\/\/.*/).withMessage(`Input must start with http:// or https://`)
    ],
    imageController.handleAgeApi
);

module.exports = router;

