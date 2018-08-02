import React, { Component } from 'react';

class Login extends Component {

    constructor() {
        super();
        this.state = {login : false, nickname: undefined, password: undefined};
        this.handleInputNickname = this.handleInputNickname.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    }

    handleInputNickname(event) {
        event.preventDefault();
        this.setState({nickname: event.target.value})
    }

    handleInputPassword(event) {
        event.preventDefault();
        this.setState({password: event.target.value})
    }

    handleSubmitLogin(event) {
        event.preventDefault();
        let bodyInfo = {nickname: this.state.nickname, password: this.state.password};
        fetch('/login', {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'include',
            body: JSON.stringify(bodyInfo)
        }).then(resp => resp.text())
        .then(respBody => {
            let success = JSON.parse(respBody);
            let nicknameValue = success? this.state.nickname : undefined;

            //sending login confirmation to main app
            this.props.setLoginSuccessFunction(success, nicknameValue);

            /*let token = respBody;
            let success = token !== "" ? true : false;
            let nicknameValue = success? this.state.nickname : undefined;

            //sending login confirmation to main app
            this.props.setLoginSuccessFunction(success, nicknameValue, token);*/

            //update state and rerender
            this.setState({login : success}) 
        })  
    }

    render() {
        return (<div>
        {!this.state.login ? 
        (<div>
            <h4>Please, enter:</h4>
            <form onSubmit={this.handleSubmitLogin}>
                <div>Nickname: <input type="text" value={this.state.inputNickname} onChange={this.handleInputNickname} /></div>
                <div>Password: <input type="password" value={this.state.inputPassword} onChange={this.handleInputPassword} /></div>                
                <div><input className="buttonForm" type="submit" value="Send" /></div>
            </form>

        </div>) : (<div>Login success!, enjoy chat!!</div>)}        
        </div>)
    }
}

export default Login;