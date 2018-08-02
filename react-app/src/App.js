import React, { Component } from 'react';
import './App.css';
import userImage from './user.png'
import Account from './Account.js';
import Login from './Login.js';
import Chat from './Chat.js';
import ActiveUsers from './ActiveUsers.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      registerForm: false,
      loginForm: false,
      registerSuccess: false,
      loginSuccess: false,
      errorMessage: '',
      chat: false,
      nickname: undefined,
      token: undefined
    }
    this.setLoginSuccess = this.setLoginSuccess.bind(this);
    this.setRegisterSuccess = this.setRegisterSuccess.bind(this);
    this.showRegisterForm = this.showRegisterForm.bind(this);
    this.showLoginForm = this.showLoginForm.bind(this);
  }

  componentDidMount() {
    fetch('/init', {
      method: 'GET',
      mode: 'same-origin',
      credentials: 'include'
    })
      .then(response => response.text())
      .then(responseBody => {
        if (responseBody !== "") {
          //let parsedResponse = JSON.parse(responseBody); 
          let parsedResponse = responseBody; 
          this.setState({ loginSuccess: true,  nickname:parsedResponse})
        } else {
          this.setState({ loginSuccess: false})
        }        
      })
  }

  setLoginSuccess(success, nicknameRet) {
    this.setState({ loginSuccess: success, loginForm: !success, errorMessage: !success ? 'Login error' : 'Login success!, enjoy chat', nickname: nicknameRet });
  }

  setRegisterSuccess(success) {
    this.setState({ registerSuccess: success, registerForm: !success, errorMessage: !success ? 'Register error' : 'Register success!, please login' });
  }

  showRegisterForm() {
    this.setState({ registerForm: true, loginForm: false });
  }
  showLoginForm() {
    this.setState({ loginForm: true, registerForm: false });
  }

  render() {
    return (
      <div className="box">
        <div className="options">
          <div className="space" />
          <div><input type="button" className="button" value="LOGIN " disabled={this.state.loginSuccess} onClick={this.showLoginForm} /></div>
          <div className="space" />
          <div><input type="button" className="button" value="REGISTER" disabled={this.state.loginSuccess} onClick={this.showRegisterForm} /></div>
          <div className="space" />
          <div><h3>{this.state.errorMessage}</h3></div>
          <div className="space" />
          {this.state.loginSuccess ? (<div><ActiveUsers /></div>) : (<div></div>)}
          <div className="space" />
          <div><h3><img src={userImage} width="40px" height="40px" />{this.state.nickname}</h3></div>
        </div>
        <div className="forms">
          {this.state.loginForm ? (<div><Login setLoginSuccessFunction={this.setLoginSuccess} /></div>) : (<div></div>)}
          {this.state.registerForm ? (<div><Account setRegisterSuccessFunction={this.setRegisterSuccess} /></div>) : (<div></div>)}
          {this.state.loginSuccess ? (<div><Chat nickname={this.state.nickname} show={this.state.loginSuccess} /></div>) : (<div></div>)}
        </div>
      </div>
    );
  }
}

export default App;