const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const fs = require('fs');

app.use(bodyParser.raw({ type: '*/*' }));

let serverState = {
    messages: [], //{nickname: nickname, message: message}
    accounts: [], //{nickname: nickname, password: password}
    sessions: [], //{nickname: nickname, token: token}
    activeUsers: {} //{nickname: Date} map
}

app.get('/init', (req, res) => {
    let sessionID = getSessionIdFromCookie(req);

    //verify if is a user has already a valid session
    let ses = serverState.sessions.filter(usr => usr.token === sessionID);
    if (ses.length > 0) {
        res.send(ses[0].nickname); //no require login again
    } else {
        res.send(""); //require login 
    }
});

app.get('/messages', (req, res) => {
    let lastTenMessages = [];
    let sessionID = getSessionIdFromCookie(req);

    //verify if is a user valid session, if not return empty messages
    if (serverState.sessions.filter(usr => usr.token === sessionID)) {
        if (serverState.messages.length > 10) {
            lastTenMessages = serverState.messages.slice(serverState.messages.length - 9, serverState.messages.length);
        } else {
            lastTenMessages = serverState.messages;
        }
    }
    res.send(JSON.stringify(lastTenMessages));
});

app.post('/addMessage', (req, res) => {
    let mesBody = JSON.parse(req.body.toString());
    let sessionID = getSessionIdFromCookie(req);
    let sessFiltered = serverState.sessions.filter(user => user.nickname === mesBody.nickname).filter(usr => usr.token === sessionID);

    //verify: if session is valid add the message, if not dont add nothing
    if (sessFiltered.length > 0) {
        serverState.messages.push({ nickname: mesBody.nickname, message: mesBody.message });
        serverState.activeUsers[mesBody.nickname] = new Date();
        res.send("User allowed");
    } else {
        res.send("Hacker");
    }

})

app.post('/createAccount', (req, res) => {
    let mesBody = JSON.parse(req.body.toString());
    //verify if nickename alrready exist
    //let accFilter = serverState.accounts.filter(usr => usr.nickname === mesBody.nickname);
    //if (accFilter.length === 0) {
    if (!getUserInfoFromFile(mesBody)) {
        //save in file
        try {
            mesBody.password = sha256(mesBody.password);
            fs.appendFileSync("./data.json", JSON.stringify(mesBody) + "\n");
        } catch (err) {
            console.log("Error saving in file");
        }
        serverState.accounts.push(mesBody);
        res.send("true")
    } else {
        res.send("false");
    }
})

app.post('/login', (req, res) => {
    let mesBody = JSON.parse(req.body.toString());
    let nickname = mesBody.nickname;
    let password = mesBody.password;
    //let accFiltered = serverState.accounts.filter(user => user.nickname === nickname).filter(usr => usr.password === password);
    //if (accFiltered.length > 0) {
    if (getUserInfoFromFile(mesBody)) {    
        //register session 
        let token = Math.floor(Math.random() * 10000) + "";
        serverState.sessions.push({ nickname: nickname, token: token });
        //notify to all new user connected
        serverState.messages.push({ nickname: '', message: 'user "' + nickname + '" has entered' });
        //send cookie and response
        res.cookie('cookieLinda', token);
        res.send("true"); //true token
    } else {
        res.send("false"); //false
    }
})

app.get('/activeUsers', (req, res) => {
    //remove from list users inactives
    Object.keys(serverState.activeUsers).forEach((key) => {
        //console.log(`key: ${key}, value: ${obj[key]}`)
        let lastDate = serverState.activeUsers[key];
        let timediff = new Date().getTime() - lastDate.getTime();
        let minutes = timediff / (1000 * 60);
        if (minutes > 5) {
            delete serverState.activeUsers[key];
            serverState.messages.push({ nickname: '', message: 'user "' + key + '" inactive' });
        }
    });

    res.send(JSON.stringify(serverState.activeUsers));
});

function getSessionIdFromCookie(req) {
    let sessionID = req.headers.cookie != undefined ? req.headers.cookie.split("=")[1] : "";
    return sessionID;
}

function getUserInfoFromFile(mesBody) {
    let existUser = false;
    try {
        userFile = fs.readFileSync("./data.json").toString();
        if (userFile != null && userFile !== undefined) {
            let newArray = userFile.split('\n');

            newArray.forEach(e => {
                if (e !== undefined && e !== null && e !== "") {
                    let usrObject = JSON.parse(e);
                    if (usrObject.nickname === mesBody.nickname
                        && usrObject.password === sha256(mesBody.password)) {
                            existUser = true;
                    }
                }
            })
        }
    } catch (err) {
        console.log("Error reading from file");
    }

    return existUser;
}
app.listen(4000, () => console.log("Server listen in port 4000"));