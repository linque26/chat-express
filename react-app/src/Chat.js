import React, { Component } from 'react';
import './App.css';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { inputText: '', messages: [], nickname: props.nickname}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        function getMessages() {
            fetch('/messages', {
                method: 'GET',
                mode: 'same-origin',
                credentials: 'include'
            })
                .then(response => response.text())
                .then(responseBody => {
                    let parsedResponse = JSON.parse(responseBody);
                    this.setState({ messages: parsedResponse })
                })
        }
        getMessages = getMessages.bind(this);
        setInterval(getMessages, 1000);
    }

    handleSubmit(event) {
        event.preventDefault();
        let bodyInfo = { nickname: this.state.nickname, message: this.state.inputText }
        this.setState({ inputText: '' })
        fetch('/addMessage', {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'include',
            body: JSON.stringify(bodyInfo)
        })
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({ inputText: event.target.value })
    }

    render() {
        return (
            this.props.show ? 
            <div className="chatContainer">
                <div id="titleChatRoom"><h3>Chat room 1</h3></div>
                <div >
                    <div>{this.state.messages.map(m => (<div><div><b>{m.nickname}</b>:{m.message}<div>&nbsp;</div></div></div>))}</div>
                </div>
                <div className="botcontainer">
                    <form onSubmit={this.handleSubmit}>
                        <div className="chat">
                            <input id="chatInput" size="31" type="text" value={this.state.inputText} onChange={this.handleChange}></input>
                            <input type="submit" value="Send" />
                        </div>
                    </form>
                </div>                
            </div>
           : null 
        )
    }
}

export default Chat;

//className="topcontainer"
//className="botcontainer"