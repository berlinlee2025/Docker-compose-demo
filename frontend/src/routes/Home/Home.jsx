import React, { useEffect, useContext } from 'react';
// import Rank from '../../components/Rank/Rank';
import CheckRecordsPanel from '../../components/CheckRecords/CheckRecordsPanel';
import ImageLinkForm from '../../components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from '../../components/AIRecognition/FaceRecognition/FaceRecognition';
import ColorRecognition from '../../components/AIRecognition/ColorRecognition/ColorRecognition';
import AgeRecognition from '../../components/AIRecognition/AgeRecognition/AgeRecognition';

// Context API
import { UserContext } from "../../shared/context/user-context";
import { RecordContext } from '../../shared/context/record-context';
import { AIContext } from '../../shared/context/ai-context';

// Parent component
// src/App.js
const Home = () => {
    const userContext = useContext(UserContext);
    const recordContext = useContext(RecordContext);
    const aiContext = useContext(AIContext);

    // Making userData available before <FaceRecognition /> <ColorRecognition /> <AgeRecognition /> needing user.id for fetching data to Node.js server
    
    /* onMount to DOM tree of <Home /> once only */
    useEffect(() => {
        console.log(`\ncomponent Home.jsx is mounted!\n`);
        userContext.onRouteChange('home');
    }, []); 

    return (
        <React.Fragment>
            <CheckRecordsPanel 
                user={userContext.user} 
                isSignedIn={userContext.isSignedIn}
                onRouteChange={userContext.onRouteChange}

                resetState={recordContext.resetState} 
                // 1. 'Home' page
                onHomeButton={recordContext.onHomeButton}
                // 2. 'Celebrity records' page
                userCelebrityRecords={recordContext.userCelebrityRecords}
                onCelebrityRecordsButton={recordContext.onCelebrityRecordsButton}
                // 3. 'Color records' page
                userColorRecords={recordContext.userColorRecords}
                onColorRecordsButton={recordContext.onColorRecordsButton}
                // 4. 'Age records' page
                userAgeRecords={recordContext.userAgeRecords}
                onAgeRecordsButton={recordContext.onAgeRecordsButton}
            />
            <ImageLinkForm
                onInputChange={aiContext.onInputChange}
                onCelebrityButton={aiContext.onCelebrityButton}
                onColorButton={aiContext.onColorButton}
                onAgeButton={aiContext.onAgeButton}
                face_hidden={aiContext.face_hidden}
                color_hidden={aiContext.color_hidden}
                age_hidden={aiContext.age_hidden}
            />
            <FaceRecognition
                user={userContext.user}
                onRouteChange={userContext.onRouteChange}

                input={aiContext.input}
                imageUrl={aiContext.imageUrl}
                box={aiContext.box}
                celebrityName={aiContext.celebrityName}
                face_hidden={aiContext.face_hidden}
            />
            <ColorRecognition
                user={userContext.user}
                onRouteChange={userContext.onRouteChange}

                input={aiContext.input}
                imageUrl={aiContext.imageUrl}
                color_props={aiContext.color_props}
                color_hidden={aiContext.color_hidden}
                name={aiContext.name}
                // onSaveColorButton={onSaveColorButton}
            />
            <AgeRecognition
                user={userContext.user}
                onRouteChange={userContext.onRouteChange}

                age={aiContext.age}
                input={aiContext.input}
                imageUrl={aiContext.imageUrl}
                age_hidden={aiContext.age_hidden}
            />
        </React.Fragment>
    )
};

export default Home;