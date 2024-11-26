const { printDateTime } = require('../../util/printDateTime');

const db = require('../../util/database');

const HttpError = require('../../models/http-error');

// create / route as an Actuactor for health-checks
exports.handleRoot = (req, res) => {
    printDateTime();

    const callbackName = `handleRoot`;
    console.log(`\nJust received an HTTP request for:\n${callbackName}\n`);

    db.raw("SELECT 1")
    .then((result) => {
        console.log(`\nPostgreSQL connected!!\n`);
        res.status(200).json(result);
    })
    .catch((err) => {
        console.error(`\nPostgreSQL not connected\nErrors: ${err}\n`);
        // next(new HttpError('Database connection error', 503));
        return res.status(503).json({
            success: false,
            status: { code: 503 },
            message: `Database not connected`
        })
    });
};

