const { printDateTime } = require('../util/printDateTime');

// PUT to update entries
/* Declaring a custom callback to accept passed-in param 'imageUrl' */
const returnClarifaiRequestOptions = (imageUrl) => {
    printDateTime();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(500).json({
        success: false,
        status: { code: 500 },
        message: `Invalid inputs`
      });
    }
    
    const PAT = process.env.PAT;
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;
    const IMAGE_URL = imageUrl;

    const callbackName = `returnClarifaiRequestOptions`;
    console.log(`\nJust received an HTTP request for:\n${callbackName}\n\nimageUrl:\n${imageUrl}\n`);
  
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL
            }
          }
        }
      ]
    });
  
    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT
      },
      body: raw
    };
    return requestOptions;
};

module.exports = { returnClarifaiRequestOptions }