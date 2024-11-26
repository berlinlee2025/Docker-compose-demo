import React, {useState, useEffect, useRef } from "react";
import "./Slideshow.scss";
import { MaterialSymbol } from 'react-material-symbols';
import 'react-material-symbols/rounded';

import Loading from "../../../../components/Loading/Loading";
import '../../../../sass/base/_utilities.scss';

// Parent component
// 1. src/routes/Records/ColorRecords.jsx
const SlideshowCelebrityRecords = ( { 
    dimensions,
    userCelebrityRecords
    } ) => {
    
    // useState Slideshow Photos' index
    const [activeIndex, setActiveIndex] = useState(0);
    const indexRef = useRef(activeIndex); // Create a ref to store the current index

    // Declare Mobile breakpoint
    const desktopBreakpoint = 1280;
    const mobileBreakpoint = 600;

    const slideshowWidthGt = '514px';
    // For window.inner.width < 
    const slideshowWidthLt = Math.floor(dimensions.width * 0.879);
    //console.log(`slideshowWidth: ${slideshowWidth}`);
    
    const slideshowHeightGt = Math.floor(dimensions.width * 0.25);
    const slideshowHeightLt = Math.floor(slideshowWidthLt * 2.2);

    const btnParentWidthGt = Math.floor(slideshowWidthGt * 0.12);
    const btnParentWidthLt = Math.floor(slideshowWidthLt * 0.12);

    const indicatorBtnWidthGt = Math.floor(slideshowWidthGt * 0.06);
    const indicatorBtnWidthLt = Math.floor(slideshowWidthLt * 0.05);

    // Depicting userCelebrityRecords[[{}, {}, {}]]
    // const userCelebrityRecordsArray = userCelebrityRecords ? userCelebrityRecords : [];
    // const userCelebrityRecordsArray = localStorage.getItem('celebrityRecords');
    const userCelebrityRecordsArray = Array.isArray(userCelebrityRecords) ? userCelebrityRecords : [];

    // To update Slideshow Photos' index
    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            // Not to show when officePhotos.length < 0
            newIndex = 0;
        } else if (newIndex >= userCelebrityRecordsArray.length) {
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
    
    if (!userCelebrityRecordsArray.length) return <Loading />;

    console.log(`\nSlideshowCelebrityRecords:\n`, userCelebrityRecordsArray, `\n`);

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
                            Datetime of record
                        </h3>
                        <p className="slideshow__inner--p">{userCelebrityRecordsArray[activeIndex].date_time}</p>
                        <br/>
                        <div className="slideshow__inner--celebrity">
                            <h4 className="slideshow__inner--p">
                                {userCelebrityRecordsArray[activeIndex].celebrity_name}
                            </h4>
                            <div className="slideshow__inner--celebrity" >
                                <img className="slideshow__inner--celebrityImg" src={userCelebrityRecordsArray[activeIndex].image_blob} alt="celebrity-blob" />
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
                            {userCelebrityRecordsArray.map((record, index) => (
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

export default SlideshowCelebrityRecords;