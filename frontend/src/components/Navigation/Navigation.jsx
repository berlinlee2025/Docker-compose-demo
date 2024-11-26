import classes from './Navigation.module.css';
import '../../sass/components/_button.scss';
import React, { useContext } from 'react';

import { UserContext } from '../../shared/context/user-context';

// Parent component
// src/App.js
const Navigation = () => {
    const userContext = useContext(UserContext);
    
    return (
        userContext.isSignedIn && userContext.user ? 
        <React.Fragment>
        <div className={`${classes.navContainer}`} id="navigation">
            <nav 
            className={`${classes.navSignedIn}`}
            // style={{display: 'flex', justifyContent: 'flex-end', width: '95%', position: 'absolute' }}
            >
            {/* If 'Sign Out' is clicked, nav to 'signin' page */}
                <p 
                className={`${classes.navPara}`}
                onClick={userContext.onSignout} 
                >
                    Sign Out
                </p>
            </nav>
        </div>
        </React.Fragment> 
        :
        <React.Fragment>
            <div className={`${classes.navBoxSignedOut}`}>
            {/* If 'Signin' is clicked, nav to 'signin' page */}
                <nav
                    className={`${classes.navSignedOut}`} 
                >
                    <p 
                    className={`${classes.navPara}`}
                    onClick={() => userContext.onRouteChange('signin')} 
                    >
                        Sign In
                    </p>
                    {/* If 'Register' is clicked, nav to 'register' page */}
                    <p 
                    className={`${classes.navPara}`}
                    onClick={() => userContext.onRouteChange('register')} 
                    >
                        Register
                    </p>
                </nav>
            </div>
        </React.Fragment>
    );    
};

export default Navigation