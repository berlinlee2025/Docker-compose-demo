// Parent component
// src/App.js
import React, { useContext } from 'react';

// import Slideshow to display ColorRecords
import SlideshowColorRecords from './Slideshow-ColorRecords/Slideshow-ColorRecords';
import "../records.scss";

import { UserContext } from '../../../shared/context/user-context';
import { RecordContext } from '../../../shared/context/record-context';

// Parent component
// src/App.js
// Child component
// src/components/Records/ColorRecords/Slideshow-ColorRecords/Slideshow-ColorRecords.jsx
const ColorRecords = ( {
    dimensions,
    userColorRecords
} ) => {
    const userContext = useContext(UserContext);
    const recordContext = useContext(RecordContext);

    return (
        <React.Fragment>
            {/* <CheckRecordsPanel /> */}
            <div className="container frosted">
            <h1 className="recordsHeading frosted__children">Color Records</h1>
            <SlideshowColorRecords 
                user={userContext.user} 
                isSignedIn={userContext.isSignedIn} 
                dimensions={dimensions}
                // User's Color Records
                userColorRecords={recordContext.userColorRecords}
            />
            </div>
        </React.Fragment>
    )
};

export default ColorRecords;