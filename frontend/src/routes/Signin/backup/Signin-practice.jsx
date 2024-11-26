import React, { Component } from "react";

// Make Signin a smart component
class Signin extends Component {
    constructor(props) {
        super(props);
        // Need to store <Input type="email"> && <Input type="password"> onChange values
        // to state variables
        this.state = {
            signInEmail: '',
            signInPassword: ''
        };
        // Destructuring state variables
        // const { signInEmail, signInPassword } = this.state;
    }
    // const Signin = ({ onRouteChange }) => {

    // this.function for:
    // Listens to onChange event of <Input type="email"> 
    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value }, () => {
            console.log('real-time changes on signInEmail state variable: \n', this.state.signInEmail)
        });
    }

    // this.function for:
    // Listens to onChange event of <Input type="password"> 
    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value }, () => {
            console.log('real-time changes on signInPassword state variable: \n', this.state.signInPassword)
        });
    }

    // 'Register button' onClick handler
    onSubmitSignIn = (event) => {
        event.preventDefault(); // To avoid page refresh on Signin
        // POST To READ JSON objects
        fetch('http://localhost:3000/signin', {
            method: 'POST', // READ
            headers: {'Content-Type': 'application/json'},
            // ALL Headers
            // Accept: Client can specify in which format to receive data
            // Accept-Language, Content-Language, Content-Type, Range
            body: JSON.stringify({ // page response --> stringify res.body.email && res.body.password
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data === 'success') {
                this.props.onRouteChange('home')
            }
        })
    }

    render() {
        // Destructuring onRouteChange passing from Parent App.js
        const { onRouteChange } = this.props;
        return (
            <div>
              <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
              <main className="pa4 black-80">
                <form className="measure">
                  <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                    <div className="mt3">
                      <label className="db fw6 lh-copy f6" htmlFor="email-address">
                        Email
                      </label>
                      <input
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                        type="email"
                        name="email-address"
                        id="email-address"
                        onChange={this.onEmailChange}
                      />
                    </div>
                    <div className="mv3">
                      <label className="db fw6 lh-copy f6" htmlFor="password">
                        Password
                      </label>
                      <input
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                        type="password"
                        name="password"
                        id="password"
                        onChange={this.onPasswordChange}
                      />
                    </div>
                    {/* <label className="pa0 ma0 lh-copy f6 pointer">
                      <input type="checkbox" /> Remember me
                    </label> */}
                  </fieldset>
                  <div className="">
                    <input
                      onClick={this.onSubmitSignIn}
                      className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                      type="submit"
                      value="Sign in"
                    />
                  </div>
                  <div className="lh-copy mt3">
                    <p
                     onClick={() => onRouteChange('register')} 
                     className="f6 link dim black db pointer">
                      Register
                    </p>
                  </div>
                </form>
              </main>
              </article>
            </div>
          );
    }

};

export default Signin;
