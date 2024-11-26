import React, { useState, useEffect, useContext } from "react";
import classes from "./CheckRecords.module.scss";
import '../../sass/base/_utilities.scss';

import CheckRecordsLi from "./CheckRecordsLi";
import Logo from "../Logo/Logo";

import { UserContext } from "../../shared/context/user-context";
import { RecordContext } from "../../shared/context/record-context";

// Parent components
// 1. src/routes/Home.jsx
// Child components
// 2. src/components/CheckRecords/CheckRecordsLi.jsx
const CheckRecordsPanel = ({ 
  resetState  
}) => {
  const userContext = useContext(UserContext);
  const recordContext = useContext(RecordContext);

  // Keep monitor resolution changes
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // Nav toggle
  const [toggle, setToggle] = useState(false);
  
  // For Nav List hidden items margin-bottom
  // window.dimensions.width < 850
  const navListMarginBottomLt = Math.floor(dimensions.width * 0.1);

  // window.dimensions.width >= 850
  const navListMarginBottomGt = Math.floor(dimensions.width * 0.1);
  const navListMarginBottomGGt = Math.floor(navListMarginBottomGt * 2.0);
  //console.log(`navListMarginBottom: ${navListMarginBottom}`);

  // For Nav List items font sizes
  // When window.inner.width >= 860px
  // fontGt scale must be < fontLt scale
  const fontGt = Math.floor(dimensions.width * 0.016);
  //console.log(`fontGt(px): ${fontGt}`);

  // For Nav List item font sizes
  // When window.inner.width < 860px
  // fontLt scale must be > fontGt scale
  const fontLt = Math.floor(dimensions.width * 0.03);
  //console.log(`fontLt(px): ${fontLt}`);

  // For FaList (Menu) symbol
  const FaListWidth = Math.floor(dimensions.width * 0.12);
  const mobileBreakpoint = 860;

  useEffect(() => {
      function handleResize() {
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth,
        });
      }
      window.addEventListener("resize", handleResize);
      // Clear memory leak
      return (_) => {
        window.removeEventListener("resize", handleResize);
      };
  });
  
  function Nav() {
    return (
      <div 
        className={classes.navgt}
      >
        <div
          style={{
            width: "40%",
            paddingLeft: "0%",
            alignItems: "center",
            height: "100%",
            marginTop: 5,
          }}
        >
          <Logo className={classes.logo} value="Smart Brain" />
        </div>
        <div className={`${classes.nav}`}>
          <ul className={`${classes.ls} ${classes.frosted}`}>
            <CheckRecordsLi
              user={userContext.user}
              fontGt={fontGt}
              fontLt={fontLt}
              dimensions={dimensions}
              resetState={resetState}
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
          </ul>
        </div>
      </div>
    );
  }

  return (
    userContext.isSignedIn
      ? <Nav />
      : <p>&nbsp;</p>
  );

  // return dimensions.width > mobileBreakpoint ? <NavGt860 /> : <NavLt860 />;
}

export default CheckRecordsPanel;
