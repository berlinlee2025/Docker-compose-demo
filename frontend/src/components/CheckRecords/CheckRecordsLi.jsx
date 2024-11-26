import React from 'react';
import classes from './CheckRecords.module.scss';
// Util

import useButtonTextRoll from '../../util/buttonTextRoll';

// Parent component
// src/components/CheckRecords/CheckRecordsPanel.jsx
export default function CheckRecordsLi( {
  // 1. 'Home' page
  onHomeButton,
  // 2. 'Celebrity records' page
  onCelebrityRecordsButton,
  // 3. 'Color records' page
  onColorRecordsButton,
  // 4. 'Age records' page
  onAgeRecordsButton,    
  resetState 
} ) {
  const tabs = document.querySelectorAll('.buttons__btn');
    
  return (
    <React.Fragment>
    <div className="buttons">
      <button 
          onClick={onHomeButton}
          onMouseEnter={useButtonTextRoll(tabs)}
          data-value="Home Page" 
          className={`${classes.lk} buttons__btn`}
      >
        Home Page
      </button>
      <button 
        onClick={onCelebrityRecordsButton}
        onMouseEnter={useButtonTextRoll(tabs)}
        data-value="Celebrity records" 
        className={`${classes.lk} buttons__btn`}
      >
        Celebirty records
      </button>
      <button 
        onClick={onColorRecordsButton}
        onMouseEnter={useButtonTextRoll(tabs)} 
        data-value="Color records"
        className={`${classes.lk} buttons__btn`}
      >
        Color records
      </button>
      <button 
        onClick={onAgeRecordsButton}
        onMouseEnter={useButtonTextRoll(tabs)} 
        data-value="Age records"
        className={`${classes.lk} buttons__btn`}
      >
        Age records
      </button>
    </div>
    </React.Fragment>
    )
};