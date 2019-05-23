import React, { Component } from 'react';
import {connect} from 'react-redux';

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    access_code: '',
  };

  passwordConfirmed = ( password ) => {
    // 1. if the password matches, return true
    // 2. if the password doesn't match, return false
    if ( this.state.password === this.state.confirmPassword ) {
      return true;
    } else {
      return false;
    }
  }

  registerUser = (event) => {
    event.preventDefault();

    console.log( 'passwordConfirmed()', this.passwordConfirmed() );

    // if the password input doesn't match the confirm password input
    if ( this.passwordConfirmed() ===  false ) {
      // cancel the dispatch
      this.props.dispatch({type: 'CONFIRMATION_ERROR'});
      return;
    }

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
          access_code: this.state.access_code,
        },
      });
    } else {
      this.props.dispatch({type: 'REGISTRATION_INPUT_ERROR'});
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}
        <form onSubmit={this.registerUser}>
          <h1>Register User</h1>
          <div>
            <label htmlFor="username">
              Username:
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
              />
            </label>
          </div>

          <div>
            <label htmlFor="password">
              Password:
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
            </label>
          </div>

          <div>
            <label htmlFor="password">
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                value={this.state.confirmPassword}
                onChange={this.handleInputChangeFor('confirmPassword')}
              />
            </label>
          </div>

          <div>
            <label htmlFor="access_code">
              Access Code:
              <input
                type="number"
                name="access_code"
                value={this.state.access_code}
                onChange={this.handleInputChangeFor('access_code')}
              />
            </label>
          </div>

          <div>
            <input
              className="register"
              type="submit"
              name="submit"
              value="Register"
            />
          </div>
        </form>
        <center>
          <button
            type="button"
            className="link-button"
            onClick={() => {this.props.dispatch({type: 'SET_TO_LOGIN_MODE'})}}
          >
            Login
          </button>
        </center>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(RegisterPage);

