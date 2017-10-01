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
                <div id="messages-container" className="ui two column grid row"> 
                    <div className="four wide column">
                        <div className="ui list">
                            {/* make separate modules of channels */}
                            <div className="item">
                                <img className="ui avatar image" src="https://semantic-ui.com/images/avatar2/small/rachel.png"/>
                                <div className="content">
                                    <a className="header">Random-channel</a>
                                    <div className="description">
                                        <span>Channel description</span>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <img className="ui avatar image" src="https://semantic-ui.com/images/avatar2/small/rachel.png"/>
                                <div className="content">
                                    <a className="header">News</a>
                                    <div className="description">
                                        <span>What's up in the world</span>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <img className="ui avatar image" src="https://semantic-ui.com/images/avatar2/small/rachel.png"/>
                                <div className="content">
                                    <a className="header">Development</a>
                                    <div className="description">
                                        <span>Join with other devs</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="twelve wide column left-border">
                    {
                        messages.map(function (entry, i){
                            return <Message key={i} user={entry.user} message={entry.message} />
                        })
                    }
                    </div>
                </div>
                <div className="ui action input row">
                    <input type="text" placeholder="Message..." onChange={ this.messageUpdated } />
                    <button className="ui button" onClick={e => this.messagePosted(message, user)}> Post </button>
                </div>
            </div>
        );
    }
}

export default Chat;