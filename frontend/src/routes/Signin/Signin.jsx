import React, { useState, useEffect, useContext } from "react";
import classes from './Signin.module.css';
import '../../sass/base/_utilities.scss';

import { UserContext } from "../../shared/context/user-context";

// Parent component
// src/App.js
const Signin = () => {
  const userContext = useContext(UserContext);

  const [ signInEmail, setSignInEmail ] = useState('');
  const [ signInPassword, setSignInPassword ] = useState('');
  const [ lockSignIn, setLockSignin ] = useState(true);
  const [ hint, setHint ] = useState('');

  useEffect(() => {
    console.log(`\ncomponent Signin.jsx is mounted!\n`);
  }, []);

  useEffect(() => {
    const validateInputs = () => {
      setLockSignin(!(signInEmail.length > 0 && signInPassword.length > 0));
    };
    validateInputs();

  }, [signInEmail, signInPassword]); // Listen to changes in 'signInEmail' & 'signInPassword'

  // Listens to onChange events of email && password <input>
  const onEmailChange = (event) => {
    setSignInEmail(event.target.value);
  }

  const onPasswordChange = (event) => {
    setSignInPassword(event.target.value);
  }

  const onIncorrect = () => {
    const signInPasswordInput = document.querySelector('#current-password');
    const email = document.querySelector('#email-address');
    signInPasswordInput.value = '';
    email.value = '';

    setHint(`Incorrect credentials, try again`);
  }

  // App 'Sign In' button onClick event handler
  const onSubmitSignIn = async (event) => {
    event.preventDefault(); // Stop page from refreshing on Signin form submission

    const devSigninUrl = 'http://localhost:3001/api/user/signin';
    const prodSigninUrl = 'https://www.ai-recognition-backend.com/api/user/signin';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodSigninUrl : devSigninUrl;

    // Fetching http://localhost:3001/api/user/signin to retrieve user
    fetch(fetchUrl, {
      method: 'POST', // Post (Create) to avoid Query Strings
      headers: {'Content-Type': 'application/json'},
      // credentials: 'include', // Include credentials to handle cookies
      body: JSON.stringify({ // sending stringified this.state variables as JSON objects
        email: signInEmail,
        password: signInPassword
      })
    })
    .then(response => response.json()) // http://localhost:3001/api/user/signin server response to parse JSON data user
    .then((user) => {
      if (user.id) { // If the user can be found & user.id exists in Postgres
        localStorage.setItem('userData', JSON.stringify(user));
        userContext.onRouteChange('home');
        userContext.saveUser(user);
      } 
      else {
        throw new Error('No user ID returned'); // Handle cases where no user ID is present
      }
    })
    .catch((err) => {
      console.error(`\nError in fetching ${fetchUrl} for signing users in:\n${err}\n`);
      onIncorrect();
    })
  };

  return (
    <React.Fragment>
    <div className="signin u-margin-bottom-medium">
      <article className={`${classes.article}`} >
      <main className={`${classes.main}`}>
        <form className="measure">
          <fieldset id="sign_up" className={`${classes.fieldset}`}>
            <legend className={`${classes.legend}`}>Sign In</legend>
            <div className={`${classes.emailContainer}`}>
              <label 
              className={`${classes.emailLabel}`} 
              htmlFor="email-address"
              >
                Email
              </label>
              <input
              className={`${classes.emailInput}`}
              type="email"
              name="email-address"
              id="email-address"
              onChange={onEmailChange}
              placeholder='Enter email'
              />
            </div>
            
            <div className={`${classes.passwordContainer}`}>
              <label 
              className={`${classes.passwordLabel}`} 
              htmlFor="current-password"
            >
              Password
              </label>
              <input
              className={`${classes.passwordInput}`}
              type="password"
              autoComplete="off"
              name="current-password"
              id="current-password"
              onChange={onPasswordChange}
              placeholder='Enter password'
              />
            </div>
            <p className={`${classes.hint}`}>
              {hint}
            </p>
          </fieldset>
          
          <div className={`${classes.signInBox}`}>
            <input
            onClick={onSubmitSignIn}
            disabled={lockSignIn}
            className={`${classes.signinBtn}`}
            type="submit"
            value=" Sign In "
            />
          </div>
          <div className={`${classes.registerBox}`}>
            <input
            onClick={() => userContext.onRouteChange('register')} 
            className={`${classes.signinBtn}`}
            type="submit"
            value="Register"
            />
          </div>
        </form>
      </main>
      </article>
    </div>
    </React.Fragment>
  )
};

export default Signin;
