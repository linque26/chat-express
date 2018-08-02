import React, { Component } from 'react';

class Account extends Component {

    constructor() {
        super();
        this.state = { register: false, nickname: undefined, password: undefined, repassword: undefined }
        this.handleSubmitRegister = this.handleSubmitRegister.bind(this);
        this.handleInputNickname = this.handleInputNickname.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.handleInputRePassword = this.handleInputRePassword.bind(this);
        this.validateInputs = this.validateInputs.bind(this);
    }

    handleInputNickname(event) {
        event.preventDefault();
        this.setState({ nickname: event.target.value })
    }

    handleInputPassword(event) {
        event.preventDefault();
        this.setState({ password: event.target.value })
    }
    handleInputRePassword(event) {
        event.preventDefault();
        this.setState({ repassword: event.target.value })
    }

    handleSubmitRegister(event) {
        event.preventDefault();

        if (this.validateInputs()) {
         
            let bodyInfo = { nickname: this.state.nickname, password: this.state.password };
            fetch('/createAccount', {
                method: 'POST',
                body: JSON.stringify(bodyInfo)
            }).then(resp => resp.text())
                .then(respBody => {
                    let success = JSON.parse(respBody);

                    //confirm sucess to app main
                    this.props.setRegisterSuccessFunction(success);

                    //update state and rerender
                    this.setState({ register: success })
                })
        } else {
            //confirm fail to app main
            this.props.setRegisterSuccessFunction(false);
        }    
    }

    validateInputs() {
        if (this.state.nickname !== null && this.state.nickname !== undefined 
            && this.state.password !== null && this.state.password !== undefined
            && this.state.repassword !== null && this.state.repassword !== undefined) {

            if (this.state.nickname.trim() !== "" && this.state.password.trim() !== "" &&
                this.state.repassword.trim() !== "") {

                if (this.state.password === this.state.repassword) {
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        return (<div>
            {!this.state.register ? (<div>
                <h4>Create Account:</h4>
                <form onSubmit={this.handleSubmitRegister}>
                    <div>Nickname:<input type="text" value={this.state.inputNickname} onChange={this.handleInputNickname} /></div>
                    <div>Password:<input type="password" value={this.state.inputPassword} onChange={this.handleInputPassword} /></div>
                    <div>Re-Password:<input type="password" value={this.state.inputRePassword} onChange={this.handleInputRePassword} /></div>
                    <div><input className="buttonForm" type="submit" value="Send" /></div>
                </form>
            </div>) : (<div>Register success!!, please login!</div>)}
        </div>
        )
    }

}

export default Account;
