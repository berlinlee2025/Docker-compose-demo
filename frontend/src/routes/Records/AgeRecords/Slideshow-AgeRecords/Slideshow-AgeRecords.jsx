import React, { useState, useEffect, useRef } from "react";
import "./Slideshow.scss";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

import Loading from "../../../../components/Loading/Loading";
import '../../../../sass/base/_utilities.scss';

// Parent component
// 1. src/routes/Records/AgeRecords.jsx
const SlideshowAgeRecords = ( { 
    dimensions,
    userAgeRecords
    } ) => {
    
    // useState Slideshow Photos' index
    const [activeIndex, setActiveIndex] = useState(0);
    const indexRef = useRef(activeIndex); // Create a ref to store the current index

    // Monitor resolutions
    //console.log(`dimensions.width * 0.8 * 0.5: ${dimensions.width * 0.8 * 0.5}`)
    // For window.inner.width >= 
    //const slideshowWidthGt = Math.floor(dimensions.width*0.435);

    // Declare Mobile breakpoint
    const desktopBreakpoint = 1280;
    const mobileBreakpoint = 600;

    const slideshowWidthGt = '514px';
    // For window.inner.width < 
    const slideshowWidthLt = Math.floor(dimensions?.width*0.879);
    //console.log(`slideshowWidth: ${slideshowWidth}`);
    
    const slideshowHeightGt = Math.floor(dimensions?.width * 0.25);
    const slideshowHeightLt = Math.floor(slideshowWidthLt * 2.2);

    const btnParentWidthGt = Math.floor(slideshowWidthGt * 0.12);
    const btnParentWidthLt = Math.floor(slideshowWidthLt * 0.12);

    const indicatorBtnWidthGt = Math.floor(slideshowWidthGt * 0.06);
    const indicatorBtnWidthLt = Math.floor(slideshowWidthLt * 0.05);

    // Depicting userCelebrityRecords[[{}, {}, {}]]
    const userAgeRecordsArray = Array.isArray(userAgeRecords) ? userAgeRecords : [];
    // const userAgeRecordsArray = userAgeRecords ? userAgeRecords : localStorage.getItem('ageRecords');

    // To update Slideshow Photos' index
    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            // Not to show when officePhotos.length < 0
            newIndex = 0;
        } else if (newIndex >= userAgeRecordsArray.length) {
            // When Slideshow hits the last item
            // It will just go back to 1st item => LOOP
            newIndex = 0;
            //newIndex = officePhotos.length -1;
        }
        setActiveIndex(newIndex);
    };

    useEffect(() => {
        indexRef.current = activeIndex;
    }, [activeIndex]);

    // Allow Slideshow Photos to jump every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
          
          // Increment the active index
          updateIndex(activeIndex + 1);
        }, 5000); // Advance every 5 minutes
    
        // Clear the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [activeIndex]); // Re-run the effect when activeIndex changes

    if (!userAgeRecordsArray.length) return <Loading />;

    console.log(`\nSlideshowAgeRecords:\n`, userAgeRecordsArray, `\n`);

    return (
        <React.Fragment>
            <div 
                className="slideshow"
                style={{
                    width: dimensions.width >= mobileBreakpoint ? slideshowWidthGt : slideshowWidthLt,
                    scale: dimensions.width < mobileBreakpoint ? "0.85" : ""
                }}
            >
                <React.Fragment>
                    <React.Fragment>
                    <div 
                    className="slideshow__inner" 
                    // style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                    >
                        <h3 className="slideshow__inner--heading">
                            Datetime of Age Detection Record
                        </h3>
                        <p className="slideshow__inner--p">{userAgeRecordsArray[activeIndex].date_time}</p>
                        <br/>
                        <div className="celebrity-page">
                            <h4 className="slideshow__inner--p">
                                {userAgeRecordsArray[activeIndex].age}
                            </h4>
                            <div className="age-image" >
                                <img className="age-image" src={userAgeRecordsArray[activeIndex].image_blob} alt="celebrity-blob" />
                            </div>  
                        </div>
                    </div>
                    
                    <br />
    
                    <div className="slideshow__btn u-margin-bottom-small" 
                        style={{ width: dimensions.width >= mobileBreakpoint ? slideshowWidthGt : slideshowWidthLt }}
                    >
                        <button 
                            // style={{
                            //     width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt,
                            // }}
                            style={{
                                width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt,
                                visibility: dimensions.width < 800 ? "hidden" : "visible"
                            }}
                            className="slideshow__btn--arrow frosted__children"
                            onClick={() => updateIndex(activeIndex - 1)}
                        >
                            <MaterialSymbol 
                                icon="arrow_back_ios" 
                                style={{ width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt }}
                            />
                        </button>
    
                        <div className="indicators">
                            {userAgeRecordsArray.map((record, index) => (
                            <button
                            key={index}
                            className="indicators--btn"
                            style={{
                                width: dimensions.width >= mobileBreakpoint ? Math.floor(slideshowWidthGt * 0.005) : Math.floor(slideshowWidthLt * 0.005)
                            }}
                            onClick={() => updateIndex(index)}
                            >
                            <MaterialSymbol 
                            icon="brightness_1"
                            className={`${index === activeIndex ? "indicator-symbol-active" : "indicator-symbol"}`}
                            style={{ width: dimensions.width >= mobileBreakpoint ? indicatorBtnWidthGt : indicatorBtnWidthLt }}
                            />
                            </button>
                            ))}
                        </div>
    
                        <button 
                            style={{
                                width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt,
                                visibility: dimensions.width < 800 ? "hidden" : "visible"
                            }}
                            className="slideshow__btn--arrow frosted__children"
                            onClick={() => updateIndex(activeIndex + 1)}
                        >
                            <MaterialSymbol 
                                icon="arrow_forward_ios" 
                                style={{ width: dimensions.width >= mobileBreakpoint ? btnParentWidthGt : btnParentWidthLt }}
                            />
                        </button>
                    </div>  
                    </React.Fragment>                
                </React.Fragment>
    
            </div>
        </React.Fragment>
    );
}

export default SlideshowAgeRecords;