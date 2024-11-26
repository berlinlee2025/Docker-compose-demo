// Parent component
// src/App.js

// Parent component
// src/App.js
import React, { useContext } from 'react';

// import Slideshow to display ColorRecords
import SlideshowCelebrityRecords from './Slideshow-CelebrityRecords/Slideshow-CelebrityRecords';
import "../records.scss";

import { UserContext } from '../../../shared/context/user-context';
import { RecordContext } from '../../../shared/context/record-context';

// Parent component
// src/App.js
// Child component
// src/components/Records/CelebrityRecords/Slideshow-CelebrityRecords/Slideshow-CelebrityRecords.jsx
const CelebrityRecords = ( {
    dimensions,
    userCelebrityRecords
} ) => {
    const userContext = useContext(UserContext);
    const recordContext = useContext(RecordContext);
    
    return (
        <React.Fragment>
            {/* <CheckRecordsPanel /> */}
            <div className="container frosted">
            <h1 className="recordsHeading frosted__children">Celebrity Records</h1>
            <SlideshowCelebrityRecords 
                user={userContext.user} 
                isSignedIn={userContext.isSignedIn} 
                dimensions={dimensions}
                // User's Celebrity Records
                userCelebrityRecords={recordContext.userCelebrityRecords}
            />
            </div>
        </React.Fragment>
    )
};

export default CelebrityRecords;