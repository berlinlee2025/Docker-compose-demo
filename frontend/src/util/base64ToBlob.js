/* Usage
** Converts a base64 encoded string to a Blob object
*
* @param {string} base64 => The base64 encoded string
* @param {string} mime => The MIME type of the file
* @returns {Blob} => A Blob{} representing the decoded base64 string

in any React component
import { base64ToBlob } from 'src/util/base64ToBlob';
const blob = base64
*/

const base64ToBlob = (base64, mime) => {
    /*
    // Decode the base64 string by first splitting the string to eliminate the data URL prefix (e.g., "data:image/jpeg;base64,")
    // and then using `atob` to convert the base64 encoded part to a binary string.
    // const byteCharacters = atob(base64.split(',')[1]); // Decode base64
    // const byteArrays = [];
    */

    const parts = base64.split(',');
    const base64Data = parts[1];

    const isValidBase64 = (str) => {
        const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    
        return base64Regex.test(str);
    }

    if (!isValidBase64(base64Data)) {
        // console.error("Invalid base64 data");
        return null;  // or throw an error
    }
    
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    // Since the `atob` function returns a long string of characters (bytes), we need to handle it in smaller chunks.
    // Loop through the byteCharacters in chunks; here it's done in chunks of 512 bytes.
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        // Extract a slice 'piece' of the byte string
        const slice = byteCharacters.slice(offset, offset + 512);

        // Create an [] of byte numbers => This array will hold the numeric byte values of the current slice
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            // Convert each character to a byte number using `charCodeAt` which returns the Unicode of the character.
            byteNumbers[i] = slice.charCodeAt(i);
        }

        // Convert the array of byte numbers into a type Uint8Array
        // This typed array represents an [] of 8-bit unsigned integers
        const byteArray = new Uint8Array(byteNumbers);

        // Add the byte[] to the overall list of byte arrays
        byteArrays.push(byteArray);
    }

    // Create & return a new Blob object, which combines all the byte[] into a single Blob
    // The MIME type is also specified to inform the browser about the type of file the Blob represents
    return new Blob(byteArrays, {type: mime});
};

export default base64ToBlob;