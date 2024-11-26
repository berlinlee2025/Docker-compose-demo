const rootDir = require('../util/path');
require('dotenv').config({ path: `${rootDir}/controllers/.env`});

const db = require('../util/database');
const fetch = require('node-fetch');

const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const { printDateTime } = require('../util/printDateTime');
const { returnClarifaiRequestOptions } = require('../util/returnClarifaiRequestOptions');

// console.log(returnClarifaiRequestOptions("https://upload.wikimedia.org/wikipedia/commons/4/4d/Beautiful_landscape.JPG"));

/* http://localhost:3001/celebrity-image */
exports.handleCelebrityApi = (req, res, next) => {
    printDateTime();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { userId, input } = req.body;
    
    const requestHandlerName = `rootDir/controllers/image.js\nhandleCelebrityApi`;
    
    console.log(`\n${requestHandlerName}\n\nreq.body.userId:\n${userId}\n\ntypeof req.body.input:\n${typeof input}\n`);
    
    console.log(`\nreq.userData: `, req.userData, `\n`)

    // JWT Authorization checks
    if (userId !== req.userData.userId) {
      return res.status(403).json({
        success: false, 
        status: { code: 403 },
        message: `Unauthorized`
      })
    }

    const API_BASE_URL = 'https://api.clarifai.com/v2/models/' +
          'celebrity-face-detection' +
          '/outputs';

    fetch(
        API_BASE_URL,
        returnClarifaiRequestOptions(input)
      )
      .then(response => {
        if (!response?.ok) {
          console.error(`\nFetched API\nYet failed to retrieve data...\n`);
          throw new Error(`Failed to fetch from API, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          throw new Error(`\nNo data returned by fetching ${API_BASE_URL}\n`);
        }
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(`\nError during fetch operation: ${err}\n`);
        res.status(502).json({ error: `Unable to fetch API...`, details: err.toString() });
      });
};

/* http://localhost:3001/color-image */
exports.handleColorApi = (req, res, next) => {
    printDateTime();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { userId, input } = req.body;
    
    const requestHandlerName = `rootDir/controllers/image.js\nhandleColorApi`;
    console.log(`${requestHandlerName}\n\nreq.body.userId:\n${userId}\n\ntypeof req.body.input:\n${typeof input}`);

    // JWT Authorization checks
    if (userId !== req.userData.userId) {
      return res.status(403).json({
        success: false, 
        status: { code: 403 },
        message: `Unauthorized`
      })
    }

    console.log(`\nreq.body.input:\n${input}\ntypeof input:\n${typeof input}\n`);
    const API_BASE_URL = 'https://api.clarifai.com/v2/models/' +
          'color-recognition' +
          '/outputs';

    // fetch
    fetch(
        API_BASE_URL,
        returnClarifaiRequestOptions(input)
      )
      .then(response => {
        if (!response?.ok) {
          console.error(`\nFetched API\nYet failed to retrieve data...\n`);
          throw new Error(`Failed to fetch from API, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          throw new Error(`\nNo data returned by fetching ${API_BASE_URL}\n`);
        }
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(502).json({ error: `Unable to fetch API...`, details: err.toString() });
      });
};

/* http://localhost:3001/color-image */
exports.handleAgeApi = (req, res, next) => {
    printDateTime();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { userId, input } = req.body;
    
    const requestHandlerName = `rootDir/controllers/image.js\nhandleAgeApi`;

    console.log(`\n${requestHandlerName}\n\nreq.body.userId:\n${userId}\n\ntypeof req.body.input:\n${typeof input}`);

    console.log(`\nreq.userData.userId: `, req.userData.userId, `\n`);

    // JWT Authorization checks
    if (userId !== req.userData.userId) {
      return res.status(403).json({
        success: false, 
        status: { code: 403 },
        message: `Unauthorized`
      })
    }

    console.log(`req.body.input:\n${input}\ntypeof req.body.input:\n${typeof input}`);

    const API_BASE_URL = 'https://api.clarifai.com/v2/models/' +
          'age-demographics-recognition' +
          '/outputs';

    // fetch
    fetch(
        API_BASE_URL,
        returnClarifaiRequestOptions(input)
      )
      .then(response => {
        if (!response?.ok) {
          console.error(`\nFetched API\nYet failed to retrieve data...\n`);
          throw new Error(`Failed to fetch from API, status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) {
          throw new Error(`\nNo data returned by fetching ${API_BASE_URL}\n`);
        }
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(502).json({ error: `Unable to fetch API...`, details: err.toString() });
      });
};

exports.handleImage = (req, res, next) => {
  printDateTime();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { id } = req.body;

  const requestHandlerName = `handleImage`;

  if (!id || typeof id !== 'number') {
    return res.status(400).json({
      success: false,
      status: { code: 400 },
      message: `${requestHandlerName} Invalid id: ${id}`
    });
  }
  
  // To store entries increase to DB
  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
      console.log(`\nentries stored to DB: ${entries[0].entries}`);
      // return updated entries for frontend
      res.status(200).json(entries[0].entries);
  })
  .catch(err => res.status(400).json(`unable to get entries\n${err}`))
};


