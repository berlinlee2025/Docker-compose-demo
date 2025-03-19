import React, { useState, useEffect, useContext } from 'react';
import './ColorRecognition.scss';
import '../../../sass/components/_frosted.scss';

import ColorDetails from './ColorDetails/ColorDetails';

import axios from 'axios';
// Utility functions
import blobToBase64 from '../../../util/blobToBase64';

import { AIContext } from '../../../shared/context/ai-context';

// Parent component
// src/components/Home/Home.jsx
const ColorRecognition = ({ 
    user,
    input,
    imageUrl, 
    color_props, 
    color_hidden,
    onRouteChange,
    saveToDevice
}) => {
    const [imageBlob, setImageBlob] = useState(''); // Blob { size: Number, type: String, userId: undefined }
    const [resData, setResData] = useState(null);

    // Keep tracking response.status.code as a number
    // Allow to be passed to other/child components
    // Allow other components to reset latest response.status.code
    const [responseStatusCode, setResponseStatusCode] = useState();

    const aiContext = useContext(AIContext);

    // Looking up for Users' inputs images
    // Making imageUrl Blob available before 'saveColor' button is clicked for fetching imageBlob to Node.js server
    useEffect(() => {
        if (input !== '') {
          const fetchImage = async() => {
            const fetchUrl = input;
            // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            // const proxyUrl = process.env.NODE_ENV === 'production' ? 'https://www.ai-recognition-backend.com' : 'http://localhost:3001';
      
            try {
              const response = await axios.get(`${fetchUrl}`, { responseType: 'blob' });
              console.log(`\nReceived metadata blob response:`, response, `\n`);
      
              const reader = new FileReader();
              reader.onloadend = () => {
                // useState() to store this.state.imageBlob: response.data
                setImageBlob(reader.result);
              };
              reader.readAsDataURL(response.data);
              setResData(response.data);
              console.log(`\nresponse.data:\n$`, response.data, `\n`);
            } catch (err) {
              console.error(`\nFailed to get 'blob' via axios.get(${fetchUrl}\nError: ${err}\n`);
            }
          };
          fetchImage();
        }
    }, [input]); // State management array[] to listen on imageUrl

    /* For saving Celebrity record to User's local machine using Puppeteer */
    const htmlToSave =  document.querySelector('.color-container') ? document.querySelector('.color-container').outerHTML : null;

    /* 1. Save to Account button to save Color details into PostgreSQL as blob metadata */
    const saveColor = async () => {
        // Reset latest response.status.code before next action
        // setResponseStatusCode(undefined);

        const callbackName = `src/components/AIRecognition/ColorRecognition/ColorDetails/ColorDetails.jsx\nsaveColor = async () => {...}`;

        const color_props_array = color_props;
        
        const devSaveColorUrl = 'http://localhost:3001/records/save-user-color';
        const prodSaveColorUrl = 'https://www.ai-recognition-backend.com/records/save-user-color';
        const fetchUrl = process.env.NODE_ENV === 'production' ? prodSaveColorUrl : devSaveColorUrl;

        // Assuming resData is the Blob
        const base64Metadata = await blobToBase64(resData);

        if (!base64Metadata) {
          // If Blob cannot be transformed in base64Metadata => route to 'home' page
          onRouteChange('home');
        }
    
        const imageRecord = {
        imageUrl: input,
        metadata: base64Metadata,
        dateTime: new Date().toISOString()
        };

        const imageDetails = color_props_array.map((eachColor) => {
            return {
            raw_hex: eachColor.colors.raw_hex,
            value: eachColor.colors.value,
            w3c_hex: eachColor.colors.w3c.hex,
            w3c_name: eachColor.colors.w3c.name
            }
        });
        
        const bodyData = JSON.stringify({ 
            userId: user.id, 
            imageUrl: input,
            imageRecord: imageRecord, 
            imageDetails: imageDetails 
        });

        console.log(`\nColorRecognition resData:\n`, resData, `\n`);
        console.log(`\nColorDetails saveColor user.id: `, user.id, `\n`);
        console.log(`\nColorDetails color_props: `, color_props, `\n`);
        console.log(`\nColorDetails input: `, input, `\n`);
        // console.log(`\nColorDetails saveColor imageRecord:\n`, imageRecord, `\n`);
        // console.log(`\nColorDetails saveColor imageDetails:\n`, imageDetails, `\n`);
        console.log(`\nFetching ${fetchUrl} with bodyData`, bodyData, `\n`);

        fetch(fetchUrl, {
        method: 'post', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ // sending stringified this.state variables as JSON objects
            userId: user.id,
            imageUrl: input,
            imageBlob: imageBlob ? imageBlob : '',
            imageRecord: imageRecord ? imageRecord : {},
            imageDetails: imageDetails ? imageDetails : {}
        })
        })
        .then((response) => response.json())
        .then((response) => {
        console.log(`\nColorDetails saveColor response: `, response, `\n`);
        console.log(`\nColorDetails saveColor response.message: `, response.message, `\n`);
        console.log(`\nColorDetails saveColor response.status.code: `, response.status.code);

        // Keep tracking response.status.code
        setResponseStatusCode(response.status.code);
        console.log(`\n\nsrc/components/ColorRecognition/ColorRecognition.jsx\nLatest action\nresponse.status.code:\n${responseStatusCode}\n`);

        })
        .catch((err) => {
        console.error(`\nError in callbackName:\n`, callbackName, `\n\nError: `, err, `\n`);
        })
        ;
    }

    const showModal = () => {
        // Retrieve DOM element of modal-color pop-up upon users' copy events
        const modal = document.querySelector('.modal-color');
            
        modal.style.opacity = 1;
       
        // Hide modal in 2 seconds
        setTimeout(() => modal.style.opacity=0, 2000)
    }

    if (color_hidden) return;

    return (
      <React.Fragment>
          <div className="color-container row" id="color-container">
              <div className="modal-container">
                  <div className="color-image-box frosted"> 
                      <img 
                          className="color-image frosted__children"
                          src={imageUrl}
                          alt="Ooops...It seems the entered URL is BROKEN...Please enter a working URL starting with 'https' in .jpg format"
                      />
                  </div>
              </div>
                 
              <div className="color-table">
                  <ColorDetails user={user} input={input} color_props={color_props} imageUrl={imageUrl} />        
              </div>
          </div>
          <div className='modal-color'>
            <h1 class='modal-color--inner'>
              {responseStatusCode === 200 ? 'Processed!' : 'Loading...' }
            </h1>
          </div>
          {/* Save to Account button */}
          <div className="saveBtn u-margin-top-small">
            <button 
              className="saveBtn__p"
              onClick={() => { saveColor(); showModal();} } // ColorDetails.jsx saveColor()
            >
              Save to Account
            </button>
          </div>
          {/* Save to Device button */}
          {/*
          <div className="saveBtn u-margin-top-tiny u-margin-bottom-small">
            <button 
              className="saveBtn__p"
              onClick={() => { 
                aiContext.saveToDevice(htmlToSave); 
                setResponseStatusCode(200); 
                showModal();
              }} 
            >
              Save to Device
            </button>
          </div>
          */}
        </React.Fragment>
  );
};

export default ColorRecognition;
