import React, { Component } from "react";
import openSocket from 'socket.io-client';
import Message from './Message';
import Channel from './Channel';

class Chat extends Component {
    state = {
        messageBuffer: "",
        messages: [],
        channels: [],
        activeChannel: null
    }

    componentDidMount() {
        const currentUrl = window.location.href;

        //get channels
        fetch(currentUrl + '/channels').then(res => res.json()).then((channels) => this.updateChannels(channels));

        this.socket = openSocket(currentUrl);
        var renderFunction = this.messageReceived;

        this.socket.on('message', function(msg, user, channel) {
            renderFunction(msg, user, channel);
        });
    }

    updateChannels = (channels) => {
        console.log(channels);
        this.setState({
            channels: this.state.channels.concat(channels)
        });

        this.setState({
            activeChannel: 0
        });

        console.log(this.state);
    }

    messageReceived = (msg,user, channel) => {
        console.log("MESSAGE FROM BACKEND - message: " + msg + " user: " + user + " channel: " + channel);

        if(channel !== this.state.activeChannel)
            return;

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

    messagePosted = (msg, user, channel) => {
        if(!user || user === '') {
            alert("Select username first!");
            return;
        } 
        console.log("channel:: " + channel);
        this.socket.emit('message', msg, user, channel);
        this.setState({
            messageBuffer: ''
        });
    }
    
    messageUpdated = e => {
        this.setState({
            messageBuffer: e.target.value 
        });
    }

    isChannelActive = (toCheck, currentActive) => {
        return toCheck === currentActive;
    }

    switchActiveChannel = (toChannelIndex) => {
        this.setState({
            activeChannel: toChannelIndex,
            messages: []
        });
    }

    render() {
        const user = this.props.userName;
        const message = this.state.messageBuffer;
        const messages = this.state.messages;
        const channels = this.state.channels;
        const activeChannel = this.state.activeChannel;

        var selfReference = this;

        return (
            <div>
                {/* container for messages */}
                <div id="messages-container" className="ui two column grid row"> 
                    <div className="four wide column">
                        <div id="channels">
                            <div className="ui list">
                                {
                                    channels.map(function (c, i) {
                                        return <Channel key={i} onClick={e => selfReference.switchActiveChannel(i)} active={selfReference.isChannelActive(i, activeChannel)} 
                                                    name={c.name} description={c.description ? c.description : ''} />
                                    })
                                }
                            </div>
                        </div>
                        <div>
                            <p className="text-center action-icon-container"> Add channel <i className="add square medium icon"></i></p>
                        </div>
                        
                    </div>
                    <div className="twelve wide column left-border">
                        <div id="chat-messages">
                        {
                            messages.map(function (entry, i){
                                return <Message key={i} user={entry.user} message={entry.message} />
                            })
                        }
                        </div>

                        <div className="ui action input row" id="chat-message-input">
                            <input value={message} type="text" onKeyUp={e => e.key === "Enter" ? this.messagePosted(message, user, activeChannel) : null} placeholder="Message..." onChange={ this.messageUpdated } />
                            <button className="ui button" onClick={e => this.messagePosted(message, user, activeChannel)}> Post </button>
                        </div>
                    </div>
                </div>     
            </div>
        );
    }
}

export default Chat;