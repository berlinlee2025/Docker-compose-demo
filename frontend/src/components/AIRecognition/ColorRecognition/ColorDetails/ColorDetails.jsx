import '../../../../sass/base/_utilities.scss';
import Loading from '../../../Loading/Loading';
import './ColorDetails.css';
// import '../../../ImageLinkForm/ImageLinkForm.scss';
import '../ColorRecognition.scss';
import React from 'react';

// Parent component
// src/components/AIRecognition/ColorRecognition/ColorRecognition.jsx
const ColorDetails = ({ user, input, color_props }) => {

  // Using querySelectors to retrieve all Raw Hex values as DOM objects
  const length = document.getElementsByClassName('raw-hex').length;
  const raw_hex_elements = document.getElementsByClassName('raw-hex');
  const w3c_name_elements = document.getElementsByClassName('w3c-name');
  const w3c_hex_elements = document.getElementsByClassName('w3c-hex');

  // Retrieve DOM element of modal-color pop-up upon users' copy events
  const modal = document.querySelector('.modal-color');

  // Allow user to copy values by clicking on it
  for (let i=0; i < length; i++) {
    
    // Allow users to copy raw_hex values from web-app
    const raw_hex_element = raw_hex_elements[i];

    const raw_hex_clickHandler = () => {
      navigator.clipboard.writeText(raw_hex_element.value)
      .then( () => {
        modal.style.opacity = 1;
      })
      .then(() => {
        // Pop-up disappears in 2 seconds
        setTimeout(() => modal.style.opacity=0, 2000)
      })
      .catch(err => {
        console.error("\nFailed to copy raw hex: ", err);
      });
    };
    raw_hex_element.addEventListener("click", raw_hex_clickHandler);
    

    // Allow users to copy w3c color name from web-app
    const w3c_name_element = w3c_name_elements[i];
    
    const w3c_name_clickHandler = () => {
      navigator.clipboard.writeText(w3c_name_element.value)
      .then( () => {
        modal.style.opacity = 1;
      })
      .then(() => {
        setTimeout(() => modal.style.opacity=0, 2000)
      })
      .catch(err => {
        console.error("Failed to copy w3c_name: ", err);
      });
    };
    w3c_name_element.addEventListener('click', w3c_name_clickHandler);
    
    // Allow users to copy w3c hex values from web-app
    const w3c_hex_element = w3c_hex_elements[i];
    
    const w3c_hex_clickHandler = () => {
      navigator.clipboard.writeText(w3c_hex_element.value)
      .then( () => {
        modal.style.opacity = 1;
      })
      .then(() => {
        setTimeout(() => modal.style.opacity=0, 2000)
      })
      .catch(err => {
        console.error("Failed to copy w3c hex: ", err);
      });
    };
    w3c_hex_element.addEventListener('click', w3c_hex_clickHandler);
  };

  return (
    !color_props?.length > 0 ? 
      <Loading /> :
      <React.Fragment>
        <div className="color-name">
          <div className="color-page">
            <table className="color-table">
              <tr> 
                <th>Color</th>
                <th>Raw hex</th>
                <th>Hex val</th>
                <th>W3C Color</th>
                <th>W3C Color Name</th>
                <th>W3C hex</th>
              </tr>
              {color_props.map((each) => {
                return (
                  <React.Fragment>
                      <tr>
                        <td>
                          <input 
                          type="color" 
                          value={each.colors.raw_hex} 
                          className="color"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="raw-hex"
                            value={each.colors.raw_hex}
                          />
                        </td>
                        <td className="hex-val">{each.colors.value}</td>
                        <td>
                          <input 
                            className="w3c-color"
                            type="color" 
                            value={each.colors.w3c.hex} 
                          />
                        </td>
                        <td>
                          <input 
                            className="w3c-name"
                            type="text"
                            value={each.colors.w3c.name}
                          />
                        </td>
                        <td>
                        <input
                          className='w3c-hex'
                          type="text"
                          value={each.colors.w3c.hex}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
          </table>
          </div>
        </div>
      </React.Fragment>

  )
}


export default ColorDetails;
