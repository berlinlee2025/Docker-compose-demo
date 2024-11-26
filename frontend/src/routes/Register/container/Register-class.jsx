import React, { Component } from "react";
import './Register.scss';
import Name from '../components/name/Name';
import Email from '../components/email/Email';
import Password from '../components/password/Password';
import PasswordConfirm from '../components/passwordConfirm/PasswordConfirm';

// Parent component
// src/App.js
// Make Register a smart component to process states
class Register extends Component {
  // class Register to inherit React class Component
  constructor(props) {

    super(props); // Inheriting all React class Components attributes & methods()
    
    this.state = {
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
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.route === 'home' && prevProps.route !== 'home') {
      this.props.fetchUserData();
    }

    // To keep tracking real-time users' input validations
    if (
      this.state.name !== prevState.name ||
      this.state.nameValid !== prevState.nameValid ||
      this.state.email !== prevState.email ||
      this.state.emailValid !== prevState.emailValid ||
      this.state.password !== prevState.password || 
      this.state.passwordConfirm !== prevState.passwordConfirm ||
      this.state.passwordMatch !== prevState.passwordMatch || 
      this.state.password.length !== prevState.password.length ||
      this.state.password12Char !== prevState.password12Char ||
      this.state.password1SpecialChar !== prevState.password1SpecialChar ||
      this.state.passwordNotEmpty !== prevState.passwordNotEmpty
    ) {
      this.validateInputs();
    }
  }
    
  //////// Smart component functions 
  // Listens to onChange events of name <input>
  // Trigger this.validateInputs() whenever there's any changes
  onNameChange = (event) => {
    this.setState({ name: event.target.value }, () => {
      this.validateInputs();
    })
  }
  
  // Listens to onChange events of email && password <input>
  onEmailChange = (event) => {
    this.setState({ email: event.target.value }, () => {
      this.validateInputs();
    })
  }

  onPasswordChange = (event) => {
    const newPassword = event.target.value;
    this.setState({ password: newPassword }, () => {
      this.validateInputs();
    })
  }

  onPasswordConfirmChange = (event) => {
    const newPasswordConfirm = event.target.value;
    this.setState({ passwordConfirm: newPasswordConfirm }, () => {
      this.validateInputs();
    })
  }

  // If users fail to register => Clear inputs
  resetInputs = () => {
    this.setState({
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
    });

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

  // To validate users' inputs in <Register />
  validateInputs = () => {    
        
        // Validate name input 
        const nameRegExp = new RegExp(/^[a-zA-Z]+$/, 'gm');
        const nameValidation = nameRegExp.test(this.state.name);
        if (nameValidation && this.state.name.length >= 3) {
          this.setState({
            nameValid: true
          });
        } else {
          this.setState({
            nameValid: false,
            lockRegister: true
          })
        }

        // Validate email input
        const emailRegExp = new RegExp(/^\w+@[A-Za-z]+[A-Za-z]+(\.com|\.gov|\.tw|\.cn|\.hk|\.edu|\.au|\.uk|\.net|\.io|\.gov\.hk|\.com\.hk|\.com\.tw|\.edu\.tw|\.gov\.uk|\.edu\.hk|\.edu\.uk|\.edu\.au)$/, 'gm')
        const emailValidation = emailRegExp.test(this.state.email);
        if (emailValidation) {
          this.setState({
            emailValid: true
          })
        } else {
          this.setState({
            emailValid: false,
            lockRegister: true
          });
        }

        // Validate whether password && passwordConfirm match up
        if (this.state.password && this.state.passwordConfirm && this.state.password === this.state.passwordConfirm) {
          this.setState({ 
            passwordMatch: true
          });
        } else {
          this.setState({
            passwordMatch: false,
            lockRegister: true
          });
        }
        
        // Validate whether both password && passwordConfirm length >= 12
        if (this.state.password.length >=12) {
          this.setState({
            password12Char: true
          });
        } else {
          this.setState({
            password12Char: false,
            lockRegister: true
          });
        }

        // Validate whether both password && passwordConfirm include at least 1 special character
        const specialChar = ['!', '@', '#' , '$' , '%' , '^' , '&' , '*' , '(' , ')' , '-' , '=' , '{' , '}' , '{' , '}' , '|' , '\\' , ';' , ':' , "'" , '"' , ',' , '<' , '.' , '>' , '`' , '~' ];
        const anySpecialChar = specialChar.map(element => {
          if (this.state.password.includes(element)) {
            return true;
          } else {
            return this.setState({
              password1SpecialChar: false,
              lockRegister: true
            }, () => {
              console.log(`this.state.lockRegister:\n${this.state.lockRegister}`);
            })
          }
        }) 

        if (anySpecialChar.includes(true) ) {
          this.setState({
            password1SpecialChar: true
          })
        } else {
          this.setState({
            password1SpecialChar: false,
            lockRegister: true
          })
        }

        // Validate whehter all criterion are satisfied for user registraton
        // 1. name
        // 2. email
        // 3. password && passwordConfirm match up
        // 4. password && passwordConfirm consist of at least 12 characters
        // 5. password && passwordConfirm consist of at least 1 special character
        if (this.state.nameValid && this.state.emailValid && this.state.passwordMatch && this.state.password12Char && this.state.password1SpecialChar) {
          this.setState({
            lockRegister: false // If all criterion are met => unlock 'Register' button
          }, () => {
            // console.log(`this.state.lockRegister: ${this.state.lockRegister}`);
          })
        } else {
          this.setState({
            lockRegister: true
          });
        }

        // Validate both password && passwordConfirm are not empty
        if (this.state.password !== "" && this.state.passwordConfirm !== "") {
          this.setState({
            passwordNotEmpty: true
          })
        } else {
          this.setState({
            passwordNotEmpty: false
          })
        }
  };
   
  // App 'Register' button onClick event handler
  onSubmitRegister = (event) => {

    // Stop page from refreshing on Signin form submission
    // To allow users re-enter inputs should registration fail
    event.preventDefault();

    // Fetching local web server or on Render
    this.devRegisterUrl = 'http://localhost:3001/register';
    this.prodRegisterUrl = 'https://www.ai-recognition-backend.com/register';

    const fetchUrl = process.env.NODE_ENV === 'production' ? this.prodRegisterUrl : this.devRegisterUrl;

    fetch(fetchUrl, {
      method: 'post', // to create
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ // stringifying this.state variables before fetching
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      }),
      credentials: 'include' // Frontend to receive Cookies from Node backend
    })
    .then(response => response.json()) // res.json() to parse data
    .then((user) => { // data passing in as user with props
      console.log('onRegisterSignIn - user: \n', user);

      if (user.id) { /* If we get a user with props => route to 'home'; this.props coming from App.js; Parent App.js front-end will handle user features */
        this.props.saveUser(user);
        this.props.fetchUserData();
        this.props.onRouteChange('home'); 

      } else {
        this.props.onRouteChange('register');
        
        // If users registered with existed emails
        this.setState({
          emailRegistered: true,
          email: '',
          password: '',
          passwordConfirm: ''
        });
        this.resetInputs();
      }
    })
    .catch((err) => {
      console.error(`\nFailed to register user `, err, `\n`);
    })
  }

  render() {

    // Destructuring props from this.state
    const { 
      nameValid,
      email,
      emailValid,
      password,
      passwordConfirm,
      lockRegister,
      password12Char,
      password1SpecialChar,
      passwordMatch,
      passwordNotEmpty,
      emailRegistered
      } = this.state;

    return (
      <div>
        <article className="article"> 
        <main className="article__main">
          <form className="measure" >
            <fieldset id="sign_up" className="fieldset">
              <legend className="register" >Register</legend>
              <div className="inputs" >
                <Name 
                  onNameChange={this.onNameChange}
                  nameValid={nameValid}
                />
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                    {
                      nameValid === true ?
                      `Name is valid` : `Enter a valid name`
                    }
                  </p>
                </div>
                <Email 
                  onEmailChange={this.onEmailChange}
                  emailValid={emailValid}
                />
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                    {
                    emailValid === true ? 
                    `Email is valid` : `Enter a valid email`
                    }
                  </p>
                </div>
                <Password
                  onPasswordChange={this.onPasswordChange}
                  password12Char={password12Char}
                />
                <p className="hint" style={{ opacity: 0 }}>Balancing line-height</p>
                <PasswordConfirm
                  onPasswordConfirmChange={this.onPasswordConfirmChange}
                  password1SpecialChar={password1SpecialChar}
                />      
                <div className="hint-box">
                  <p
                    className="hint"
                  >
                    {
                    passwordNotEmpty === false ?
                    `Pw cannot be empty` 
                    :
                    password === passwordConfirm ? 
                    `Password MATCH!` : `Password must MATCH`
                    }
                  </p>     
                  <br/>
                  <p
                    className="hint"
                  >
                    {
                    emailRegistered === true ?
                    `Try using another email!` : ``
                    }
                  </p>
                </div>
              </div>
            </fieldset>

            <div className="registerBtnBox">
              <input
                onClick={this.onSubmitRegister}
                disabled={lockRegister}
                className={lockRegister === true ? 
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
}
export default Register;
