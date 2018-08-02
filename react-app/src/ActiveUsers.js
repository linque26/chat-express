import React, { Component } from 'react';
import './App.css';

class ActiveUsers extends Component {
    constructor() {
        super();
        this.state = { activeUsers: {} }
        this.getActiveUsers = this.getActiveUsers.bind(this);
    }
    componentDidMount() {
        function getActiveUsers() {
            fetch('/activeUsers', {
                method: 'GET',
            })
                .then(response => response.text())
                .then(responseBody => {
                    let parsedResponse = JSON.parse(responseBody);
                    this.setState({ activeUsers: parsedResponse })
                })
        }
        getActiveUsers = getActiveUsers.bind(this);
        setInterval(getActiveUsers, 5000);
    }

    getActiveUsers() {        
        let keys = Object.keys(this.state.activeUsers);
        if (keys) { 
            return keys.map(m => (<div>:) <b>{m}</b></div>));
        } 
        return "";
    }

    render() {
        return (
            <div className="activeUserContainer">
                <div><b>Active users:</b></div>
                <br/>
                <div>
                {this.getActiveUsers()}                
                </div>
            </div>
        )
    }
}

export default ActiveUsers;

//<img src="user.png"  height="10" width="10" />