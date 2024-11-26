import React, { useState, useEffect, useContext } from "react";
import './Register.scss';
import Name from '../components/name/Name';
import Email from '../components/email/Email';
import Password from '../components/password/Password';
import PasswordConfirm from '../components/passwordConfirm/PasswordConfirm';

import { UserContext } from "../../../shared/context/user-context";

// Parent component
// src/App.js
// Make Register a smart component to process states
const Register = (props) => {

  const userContext = useContext(UserContext);

  const [state, setState ] = useState({
      name: '',
      nameValid: false,
      email: '',
      emailValid: false,
      password: '',
      passwordConfirm: '',
      lockRegister: true,
      password12Char: false,
      password1SpecialChar: false,
      passwordMatch: false,
      passwordNotEmpty: false,
      emailRegistered: false
  });

  useEffect(() => {
    if (props.route === 'home') {
      userContext.fetchUserData();
    }
  }, [props.route, userContext]);

  // useEffect to trigger validateInputs() whenever listen var changes
  useEffect(() => {
    // To validate users' inputs in <Register />
    const validateInputs = () => {    
          
      // Validate name input 
      const nameRegExp = new RegExp(/^[a-zA-Z]+$/, 'gm');
      const nameValidation = nameRegExp.test(state.name);
      if (nameValidation && state.name.length >= 3) {
        setState(prevState => ({
          ...prevState,
          nameValid: true
        })
        );
      } else {
        setState(prevState => ({
          ...prevState,
          nameValid: false,
          lockRegister: true
        })
        )
      }

      // Validate email input
      const emailRegExp = new RegExp(/^\w+@[A-Za-z]+[A-Za-z]+(\.com|\.gov|\.tw|\.cn|\.hk|\.edu|\.au|\.uk|\.net|\.io|\.gov\.hk|\.com\.hk|\.com\.tw|\.edu\.tw|\.gov\.uk|\.edu\.hk|\.edu\.uk|\.edu\.au)$/, 'gm')
      const emailValidation = emailRegExp.test(state.email);
      if (emailValidation) {
        setState(prevState => ({
          ...prevState,
          emailValid: true
        })
        )
      } else {
        setState(prevState => ({
          ...prevState,
          emailValid: false,
          lockRegister: true
        })
        );
      }

      // Validate whether password && passwordConfirm match up
      if (state.password && state.passwordConfirm && state.password === state.passwordConfirm) {
        setState(prevState => ({ 
          ...prevState,
          passwordMatch: true
        })
        );
      } else {
        setState(prevState => ({
          ...prevState,
          passwordMatch: false,
          lockRegister: true
        })
        );
      }
      
      // Validate whether both password && passwordConfirm length >= 12
      if (state.password.length >=12) {
        setState(prevState => ({
          ...prevState,
          password12Char: true
        })
        );
      } else {
        setState(prevState => ({
          ...prevState,
          password12Char: false,
          lockRegister: true
        })
        );
      }

      // Validate whether both password && passwordConfirm include at least 1 special character
      const specialChar = ['!', '@', '#' , '$' , '%' , '^' , '&' , '*' , '(' , ')' , '-' , '=' , '{' , '}' , '{' , '}' , '|' , '\\' , ';' , ':' , "'" , '"' , ',' , '<' , '.' , '>' , '`' , '~' ];
      const anySpecialChar = specialChar.map(element => {
        if (state.password.includes(element)) {
          return true;
        } else {
          return setState(prevState => ({
            ...prevState,
            password1SpecialChar: false,
            lockRegister: true
          })
          );
        }
      }) 

      if (anySpecialChar.includes(true) ) {
        setState(prevState => ({
          ...prevState,
          password1SpecialChar: true
        })
        )
      } else {
        setState(prevState => ({
          ...prevState,
          password1SpecialChar: false,
          lockRegister: true
        })
        )
      }

      // Validate whehter all criterion are satisfied for user registraton
      // 1. name
      // 2. email
      // 3. password && passwordConfirm match up
      // 4. password && passwordConfirm consist of at least 12 characters
      // 5. password && passwordConfirm consist of at least 1 special character
      if (state.nameValid && state.emailValid && state.passwordMatch && state.password12Char && state.password1SpecialChar) {
        setState(prevState => ({
          ...prevState,
          lockRegister: false // If all criterion are met => unlock 'Register' button
        })
        )
      } else {
        setState(prevState => ({
          ...prevState,
          lockRegister: true
        })
        );
      }

      // Validate both password && passwordConfirm are not empty
      if (state.password !== "" && state.passwordConfirm !== "") {
        setState(prevState => ({
          ...prevState,
          passwordNotEmpty: true
        })
        )
      } else {
        setState(prevState => ({
          ...prevState,
          passwordNotEmpty: false
        })
        )
      }
    };

    validateInputs();
    console.log(`\nstate.name: ${state.name}\nstate.email: ${state.email}\nstate.password: ${state.password}\nstate.passwordConfirm: ${state.passwordConfirm}\n`);
    
  }, [state.name, state.nameValid, state.email, state.emailValid, state.password, state.passwordConfirm, state.passwordMatch, state.password.length, state.password12Char, state.password1SpecialChar, state.passwordNotEmpty]);
    
  const validateInputs = () => {    
          
    // Validate name input 
    const nameRegExp = new RegExp(/^[a-zA-Z]+$/, 'gm');
    const nameValidation = nameRegExp.test(state.name);
    if (nameValidation && state.name.length >= 3) {
      setState(prevState => ({
        ...prevState,
        nameValid: true
      })
      );
    } else {
      setState(prevState => ({
        ...prevState,
        nameValid: false,
        lockRegister: true
      })
      )
    }

    // Validate email input
    const emailRegExp = new RegExp(/^\w+@[A-Za-z]+[A-Za-z]+(\.com|\.gov|\.tw|\.cn|\.hk|\.edu|\.au|\.uk|\.net|\.io|\.gov\.hk|\.com\.hk|\.com\.tw|\.edu\.tw|\.gov\.uk|\.edu\.hk|\.edu\.uk|\.edu\.au)$/, 'gm')
    const emailValidation = emailRegExp.test(state.email);
    if (emailValidation) {
      setState(prevState => ({
        ...prevState,
        emailValid: true
      })
      )
    } else {
      setState(prevState => ({
        ...prevState,
        emailValid: false,
        lockRegister: true
      })
      );
    }

    // Validate whether password && passwordConfirm match up
    if (state.password && state.passwordConfirm && state.password === state.passwordConfirm) {
      setState(prevState => ({ 
        ...prevState,
        passwordMatch: true
      })
      );
    } else {
      setState(prevState => ({
        ...prevState,
        passwordMatch: false,
        lockRegister: true
      })
      );
    }
    
    // Validate whether both password && passwordConfirm length >= 12
    if (state.password.length >=12) {
      setState(prevState => ({
        ...prevState,
        password12Char: true
      })
      );
    } else {
      setState(prevState => ({
        ...prevState,
        password12Char: false,
        lockRegister: true
      })
      );
    }

    // Validate whether both password && passwordConfirm include at least 1 special character
    const specialChar = ['!', '@', '#' , '$' , '%' , '^' , '&' , '*' , '(' , ')' , '-' , '=' , '{' , '}' , '{' , '}' , '|' , '\\' , ';' , ':' , "'" , '"' , ',' , '<' , '.' , '>' , '`' , '~' ];
    const anySpecialChar = specialChar.map(element => {
      if (state.password.includes(element)) {
        return true;
      } else {
        return setState(prevState => ({
          ...prevState,
          password1SpecialChar: false,
          lockRegister: true
        })
        );
      }
    }) 

    if (anySpecialChar.includes(true) ) {
      setState(prevState => ({
        ...prevState,
        password1SpecialChar: true
      })
      )
    } else {
      setState(prevState => ({
        ...prevState,
        password1SpecialChar: false,
        lockRegister: true
      })
      )
    }

    // Validate whehter all criterion are satisfied for user registraton
    // 1. name
    // 2. email
    // 3. password && passwordConfirm match up
    // 4. password && passwordConfirm consist of at least 12 characters
    // 5. password && passwordConfirm consist of at least 1 special character
    if (state.nameValid && state.emailValid && state.passwordMatch && state.password12Char && state.password1SpecialChar) {
      setState(prevState => ({
        ...prevState,
        lockRegister: false // If all criterion are met => unlock 'Register' button
      })
      )
    } else {
      setState(prevState => ({
        ...prevState,
        lockRegister: true
      })
      );
    }

    // Validate both password && passwordConfirm are not empty
    if (state.password !== "" && state.passwordConfirm !== "") {
      setState(prevState => ({
        ...prevState,
        passwordNotEmpty: true
      })
      )
    } else {
      setState(prevState => ({
        ...prevState,
        passwordNotEmpty: false
      })
      )
    }
  };

  //////// Smart component functions 
  // Listens to onChange events of name <input>
  // Trigger this.validateInputs() whenever there's any changes
  const onNameChange = (event) => {
    setState(prevState => ({ 
      ...prevState,
      name: event.target.value 
    })
    );
    validateInputs()
  }
  
  // Listens to onChange events of email && password <input>
  const onEmailChange = (event) => {
    setState(prevState => ({ 
      ...prevState, 
      email: event.target.value 
    })
    );
    validateInputs();
  }

  const onPasswordChange = (event) => {
    const newPassword = event.target.value;
    setState(prevState => ({ 
      ...prevState,
      password: newPassword 
    })
    );
    validateInputs();
  }

  const onPasswordConfirmChange = (event) => {
    const newPasswordConfirm = event.target.value;
    setState(prevState => ({ 
      ...prevState,
      passwordConfirm: newPasswordConfirm 
    })
    );
    validateInputs();
  }

  // If users fail to register => Clear inputs
  const resetInputs = () => {
    setState(prevState => ({
      ...prevState,
      name: '',
      nameValid: false,
      email: '',
      emailValid: false,
      password: '',
      passwordConfirm: '',
      lockRegister: true,
      password12Char: false,
      password1SpecialChar: false,
      passwordMatch: false,
      passwordNotEmpty: false
    })
    );

    // Clear off previous user inputs
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const passwordConfirmInput = document.querySelector('#passwordConfirm');
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    passwordConfirmInput.value = '';
  }
   
  // App 'Register' button onClick event handler
  const onSubmitRegister = (event) => {

    // Stop page from refreshing on Signin form submission
    // To allow users re-enter inputs should registration fail
    event.preventDefault();

    // Fetching local web server or on Render
    const devRegisterUrl = 'http://localhost:3001/api/user/register';
    const prodRegisterUrl = 'https://www.ai-recognition-backend.com/api/user/register';

    const fetchUrl = process.env.NODE_ENV === 'production' ? prodRegisterUrl : devRegisterUrl;

    fetch(fetchUrl, {
      method: 'post', // to create
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ // stringifying this.state variables before fetching
        name: state.name,
        email: state.email,
        password: state.password
      }),
      // credentials: 'include' // Frontend to receive Cookies from Node backend
    })
    .then(response => response.json()) // res.json() to parse data
    .then((response) => { // data passing in as user with props
      // response: { success: boolean, status: { code: 200 }, user: { userId: number, email: string, token: string }, message: string }
      console.log('onSubmitRegister - response: \n', response);

      if (response.user) { /* If we get a user with props => route to 'home'; this.props coming from App.js; Parent App.js front-end will handle user features */
        console.log(`response: `, response, `\n`);
        
        localStorage.setItem('userData', JSON.stringify(response.user));
        // localStorage.setItem('lastRoute', 'home');
        userContext.onRouteChange('home');       
        userContext.saveUser(response.user);

      } else {
        // userContext.onRouteChange('register');
        
        // If users registered with existed emails
        setState(prevState => ({
          ...prevState,
          emailRegistered: true,
          email: '',
          password: '',
          passwordConfirm: ''
        })
        );
        
        resetInputs();
      }
    })
    .catch((err) => {
      console.error(`\nFailed to register user `, err, `\n`);
    })
  }

  return (
    <div>
      <article className="article"> 
      <main className="article__main">
        <form className="measure" >
          <fieldset id="sign_up" className="fieldset">
            <legend className="register" >Register</legend>
            <div className="inputs" >
              <Name 
                onNameChange={onNameChange}
                nameValid={state.nameValid}
              />
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                  {
                    state.nameValid === true ?
                    `Name is valid` : `Enter a valid name`
                  }
                  </p>
                </div>
              <Email 
                onEmailChange={onEmailChange}
                emailValid={state.emailValid}
              />
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                  {
                  state.emailValid === true ? 
                  `Email is valid` : `Enter a valid email`
                  }
                  </p>
                </div>
              <Password
                onPasswordChange={onPasswordChange}
                password12Char={state.password12Char}
              />
                <p className="hint" style={{ opacity: 0 }}>Balancing line-height</p>
              <PasswordConfirm
                onPasswordConfirmChange={onPasswordConfirmChange}
                password1SpecialChar={state.password1SpecialChar}
              />      
              <div className="hint-box">
                <p
                  className="hint"
                >
                {
                state.passwordNotEmpty === false ?
                `Pw cannot be empty` 
                :
                state.password === state.passwordConfirm ? 
                `Password MATCH!` : `Password must MATCH`
                }
                </p>     
                <br/>
                <p
                  className="hint"
                >
                {
                state.emailRegistered === true ?
                `Try using another email!` : ``
                }
                </p>
              </div>
            </div>
          </fieldset>

          <div className="registerBtnBox">
            <input
              onClick={onSubmitRegister}
              disabled={state.lockRegister}
              className={state.lockRegister === true ? 
              "registerBtn" :
              "registerBtn registerBtnOK"}
              type="submit"
              value="Register"
            />
          </div>
          </form>
        </main>
        </article>
      </div>
    );
  
}
export default Register;
