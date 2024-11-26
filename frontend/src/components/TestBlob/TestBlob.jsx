import React, { useState, useEffect } from "react";
import axios from 'axios';

// Passing onInputChange event listener as props to App.js
const TestMetadataBlob = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/399px-Brad_Pitt_2019_by_Glenn_Francis.jpg`;
      

      try {
        const response = await axios.get(imageUrl, { responseType: 'blob' });
        console.log(`\nTestMetadataBlob Response:`);
        console.log(response);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };

        reader.readAsDataURL(response.data);

        console.log(`\nresponse.data:\n$`, response.data, `\n`);

      } catch (err) {
        console.error(`\nFailed to fetch image:\nimageUrl:\n${imageUrl}\nError: ${err}\n`);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="test-container">
      <h2 className="">Test File Metadata Blob</h2>
      {imageSrc ? 
      <img alt="test-file-metadata-blob" src={imageSrc} /> :
      <p>Loading image...</p>
      }
    </div>
  );
};

export default TestMetadataBlob;