import React from 'react';
import loading from './loading.gif';
import './loading.scss';

export const Loading = () => {
    return (
        <React.Fragment>
        <div className="loadingContainer">
            <p className="loadingContainer__p">Loading Details...</p>
            <img className="loadingContainer__img" src={loading} alt="loading-gif" />
        </div>      
        </React.Fragment>
    )
};

export default Loading;