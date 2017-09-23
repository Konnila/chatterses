import React, { Component } from "react";
import openSocket from 'socket.io-client';
import Message from './Message';

class Chat extends Component {
    state = {
        messageBuffer: "",
        messages: []
    }

    componentDidMount() {
        const currentUrl = window.location.href;
        this.socket = openSocket(currentUrl);
        var renderFunction = this.messageReceived;

        this.socket.on('message', function(msg, user) {
            renderFunction(msg, user);
        });
    }

    messageReceived = (msg,user) => {
        console.log("MESSAGE FROM BACKEND - message: " + msg + " user: " + user);
        const updatedMessages = this.state.messages;
        const newEntry = {
            user: user,
            message: msg
        };

        updatedMessages.push(newEntry);

        this.setState({
            messages: updatedMessages
        })
    }

    messagePosted = (msg, user) => {
        console.log("message: " + msg, " user: " + user);
        this.socket.emit('message', msg, user);
    }
    
    messageUpdated = e => {
        this.setState({
            messageBuffer: e.target.value 
        });
    }

    render() {
        const user = this.props.userName;
        const message = this.state.messageBuffer;
        const messages = this.state.messages;

        return (
            <div>
                {/* container for messages */}
                <div> 
                    {
                        messages.map(function (entry, i){
                            return <Message key={i} user={entry.user} message={entry.message} />
                        })
                    }
                </div>
                <div className="ui action input">
                    <input type="text" placeholder="Message..." onChange={ this.messageUpdated } />
                    <button className="ui button" onClick={e => this.messagePosted(message, user)}> Post </button>
                </div>
            </div>
        );
    }
}

export default Chat;