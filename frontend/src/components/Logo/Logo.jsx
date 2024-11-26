import React from "react";
import Tilt from "react-parallax-tilt";
import './Logo.scss';
import brain from './smart-brain.jpg';

const Logo = () => {
  return (
    <div className="logo-container">
      <Tilt 
        className="Tilt" 
        options={{ max: 55 }} 
        style={{ 
          height: "150px", width: "150px" 
          }}
      >
        <div className="Tilt-inner">
            <img 
             className="logo"
             style={{paddingTop: '5px'}} 
             src={brain} 
             alt="smart brain" 
            />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
