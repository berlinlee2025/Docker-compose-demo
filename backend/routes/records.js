const express = require('express');
const { check } = require('express-validator');

/* Import our records controllers */
const celebrityRecordController = require('../controllers/records/celebrityRecords');
const colorRecordController = require('../controllers/records/colorRecords');
const ageRecordController = require('../controllers/records/ageRecords');

/* Calling Router from express.Router() method
router is a pluggable mini-Express app */
const router = express.Router();
const checkAuth = require('../middleware/check-auth'); // JWT Bearer

/* Adding a Filter '/records' before all Express routes below
in rootDir/server.js */

/** Adding a Bearer to all route below this Middleware */
router.use(checkAuth);

/* Registering http://localhost:3001/records/save-user-celebrity
=> Express Router POST request handler */
router.post(
    '/save-user-celebrity', 
    [
        check('userId').not().isEmpty().withMessage(`ImageUrl is required`)
        .isInt({ max: 500 }).withMessage(`ID must be <= 500`),
        check('celebrityName').not().isEmpty().withMessage(`celebrityName is required`)
        .isLength({ max: 50 }).withMessage(`CelebrityName must be <= 50 characters`),
        check('imageUrl').not().isEmpty().withMessage(`ImageUrl is required`)
        .matches(/^(http|https):\/\/.*/).withMessage(`ImageUrl must start with http:// or https://`),
        check('imageBlob').not().isEmpty().withMessage(`ImageBlob is required`)
            .matches(/^data:image\/(jpg|jpeg|webp|png|tiff|gif);base64,.*$/).withMessage(`ImageBlob must start with data:image/(jpg|jpeg|webp|png|tiff|gif)`),
        check('metadata').not().isEmpty().withMessage(`Metadata is required`)
            .matches(/^data:image\/(jpg|jpeg|webp|png|tiff|gif);base64,.*/).withMessage(`Metadata must start with data:image/(jpg|jpeg|webp|png|tiff|gif)`),
        check('dateTime').not().isEmpty().withMessage(`dateTime is required`)
            .isISO8601().withMessage(`dateTime must be a valid ISO 8601 date-time format`)
    ],
    celebrityRecordController.saveUserCelebrity
);

/* Registering http://localhost:3001/records/get-user-celebrity
=> Express Router POST request handler */
router.post(
    '/get-user-celebrity', 
    [
        check('userId').not().isEmpty().withMessage(`ImageUrl is required`)
            .isInt({ max: 500 }).withMessage(`userId must be an Integer <= 500`),
    ],
    celebrityRecordController.getUserCelebrity
);

/* Registering http://localhost:3001/records/save-user-color
=> Express Router POST request handler */
router.post(
    '/save-user-color', 
    [
        check('userId').not().isEmpty().withMessage(`ImageUrl is required`)
            .isInt({ max: 500 }).withMessage(`userId must be an Integer <= 500`),
        check('imageUrl').not().isEmpty().withMessage(`ImageUrl is required`)
            .matches(/^(http|https):\/\/.*/).withMessage(`ImageUrl must start with http:// or https://`),
        check('imageBlob').not().isEmpty().withMessage(`ImageBlob is required`)
            .matches(/^data:image\/(jpg|jpeg|webp|png|tiff|gif);base64,[A-Za-z0-9+\/=]+$/).withMessage(`ImageBlob must start with data:image/(jpg|jpeg|webp|png|tiff|gif)`),
        check('imageRecord.dateTime')
            .not().isEmpty().withMessage('DateTime is required')
            .isISO8601().withMessage('DateTime must be a valid ISO 8601 date-time format'),
        check('imageDetails.*.raw_hex')
            .matches(/^#([a-fA-F0-9]{6})$/).withMessage('Invalid raw_hex format'),
        check('imageDetails.*.value')
            .isFloat({ min: 0, max: 1 }).withMessage('Value must be a float between 0 and 1'),
        check('imageDetails.*.w3c_hex')
            .matches(/^#([a-fA-F0-9]{6})$/).withMessage('Invalid w3c_hex format'),
        check('imageDetails.*.w3c_name')
            .not().isEmpty().withMessage('w3c_name is required')
            .isString().withMessage('w3c_name must be a string'),
    ],
    colorRecordController.saveUserColor);

/* Registering http://localhost:3001/records/get-user-color
=> Express Router POST request handler */
router.post(
    '/get-user-color', 
    [
        check('userId').not().isEmpty().withMessage(`ImageUrl is required`)
            .isInt({ max: 500 }).withMessage(`userId must be an Integer <= 500`),
    ],
    colorRecordController.getUserColor
);

/* Registering http://localhost:3001/records/save-user-age
=> Express Router POST request handler */
router.post(
    '/save-user-age', 
    [
        check('userId').not().isEmpty().withMessage(`ImageUrl is required`)
            .isInt({ max: 500 }).withMessage(`userId must be an Integer <= 500`),
        check('imageUrl').not().isEmpty().withMessage(`ImageUrl is required`)
            .matches(/^(http|https):\/\/.*/).withMessage(`ImageUrl must start with http:// or https://`),
        check('imageBlob').not().isEmpty().withMessage(`ImageBlob is required`)
            .isString().withMessage(`Metadata must be a valid string`)
            .matches(/^data:image\/(jpg|jpeg|webp|png|tiff|gif);base64,[A-Za-z0-9+\/=]+$/).withMessage(`ImageBlob must start with data:image/(jpg|jpeg|webp|png|tiff|gif)`),
        check('metadata').not().isEmpty().withMessage(`Metadata is required`)
            .isString().withMessage(`Metadata must be a valid string`)
            .matches(/^data:image\/(jpg|jpeg|webp|png|tiff|gif);base64,[A-Za-z0-9+\/=]+$/).withMessage(`Metadata must start with data:image/(jpg|jpeg|webp|png|tiff|gif)`),
        check('dateTime').not().isEmpty().withMessage(`dateTime is required`)
            .isISO8601().withMessage(`dateTime must be a valid ISO 8601 date-time format`)
    ],
    ageRecordController.saveUserAgeRecords
);

/* Registering http://localhost:3001/records/get-user-age
=> Express Router POST request handler */
router.post(
    '/get-user-age', 
    [
        check('userId').not().isEmpty().withMessage(`ImageUrl is required`)
            .isInt({ max: 500 }).withMessage(`userId must be an Integer <= 500`),
    ],
    ageRecordController.getUserAgeRecords);

module.exports = router;

