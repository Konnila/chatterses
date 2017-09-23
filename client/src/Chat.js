import React, { Component } from "react";
import openSocket from 'socket.io-client';
const currentUrl = window.location.href;
const socket = openSocket(currentUrl);

class Chat extends Component {
    state = {
        messageBuffer: []
    }

    render() {
        return (
            <div className="ui action input">
                
            </div>
        );
    }
}

export default Chat;