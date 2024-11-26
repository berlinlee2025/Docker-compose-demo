const axios = require('axios');

/**
 * Fetches image from URL and returns it as a buffer
 * @param {string} imageUrl - URL of the image to fetch
 * @returns {Promise<Buffer>} - A promise that resolves to the image data as a buffer
 */

const imageUrlToBase64 = async (imageUrl) => {
    const callbackName = `rootDir/util/imageUrlToBase64(imageUrl)`;

    if (!imageUrl) {
        console.error(`\nimageUrl is undefined\ntypeof imageUrl: ${typeof imageUrl}`);
        return;
    }

    return await axios.get(imageUrl, { responseType: 'arrayBuffer'})
    .then((response) => {
        // Convert arrayBuffer to base64
        const base64 = Buffer.from(response.data, 'binary').toString('base64');

        if (base64) {
            return `data:image/jpeg;base64,${base64}`;
        } else {
            console.error(`\n${callbackName} failed to convert imageUrl to base64\n`);
        }
    })
    .catch((err) => {
        console.error(`\nFailed to get image from ${imageUrl}`, err, `\n`);
    });
};

module.exports = { imageUrlToBase64 };