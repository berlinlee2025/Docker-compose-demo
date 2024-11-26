import React from "react";
import './ImageLinkForm.scss';
import '../../sass/components/_frosted.scss';

import useButtonTextRoll from "../../util/buttonTextRoll";

// Passing onInputChange event listener as props to App.js
const ImageLinkForm = ({ 
  onInputChange, 
  onCelebrityButton, 
  onColorButton,
  onAgeButton,
}) => {
  const placeholder = `Enter hyperlink e.g. https://wiki.org/image`;
  const tabs = document.querySelectorAll('.buttons__btn');

  return (
    <div className="container row">
      <div className="link-form">
          <p className="link-form__paragraph">
            {"This Brain will detect Colors or Celebrity faces in your pictures."}
          </p>
          <p className="link-form__paragraph">{"Give it a try"}</p>
      </div>

      <div className="links">
        <div className="col-4-of-5 frosted">  
          <div className="link-container frosted__children">
            <input
              className="link-container__input"
              id="input-inner"
              type="url"
              placeholder={placeholder}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="col-1-of-5 buttons-box">
          <div className="buttons">
            <button
              className="buttons__btn"
              onClick={onCelebrityButton}
              onMouseEnter={useButtonTextRoll(tabs)}
              data-value="Detect Celebrity"
            >
              Detect Celebrity
            </button>
            <button
              className="buttons__btn"
              onClick={onColorButton}
              onMouseEnter={useButtonTextRoll(tabs)}
              data-value="Detect Color"
            >
              Detect Color
            </button>
            <button
              className="buttons__btn"
              onClick={onAgeButton}
              onMouseEnter={useButtonTextRoll(tabs)}
              data-value="Detect Age"
            >
              Detect Age
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
