import React, { Component } from "react";
import openSocket from 'socket.io-client';
import Message from './Message';
import Channel from './Channel';
import AddChannelModal from './AddChannelModal';
import $ from 'jquery';
import { fetchChannels, fetchMessages, messageAdd } from './Api';

class Chat extends Component {
    state = {
        messageBuffer: "",
        messages: [],
        channels: [],
        activeChannel: null,
        channelAddModalVisible: false
    }

    constructor() {
        super();

        this.addChannel = this.addChannel.bind(this);
        this.toggleModal = this.toggleModal.bind(this)
    }

     componentDidMount() {
        const currentUrl = window.location.href;

        //wait these first so we can initially get messages from first channel
        fetchChannels(currentUrl + 'channels', (channels) => this.updateChannels(channels, 0));

        if(this.state.channels.length > 0) {
            fetchMessages(currentUrl, this.state.channels[0]._id, (msgsObject) => this.renderMessages(msgsObject));
        }

        this.socket = openSocket(currentUrl);
        var renderFunction = this.messageReceived;

        this.socket.on('message', function(msg, user, channel) {
            renderFunction(msg, user, channel);
        });
    }

    messageReceived = (msg,user, channel) => {
        if(channel !== this.state.channels[this.state.activeChannel]._id)
            return;

        const updatedMessages = this.state.messages;
        const newEntry = {
            user: user,
            message: msg
        };

        updatedMessages.push(newEntry);

        this.setState({
            messages: updatedMessages
        });
    }

    renderMessages = (messageDboArray) => {
        if(!messageDboArray)
            return;

        const updatedMessages = this.state.messages;
        for(var i = 0; i < messageDboArray.length; i++) {
            const entry = {
                user: messageDboArray[i].user,
                message: messageDboArray[i].message
            }

            updatedMessages.push(entry);
        }

        this.setState({
            messages: updatedMessages
        });
    }

    messagePosted = (msg, user, channel) => {
        if(!user || user === '') {
            alert("Select username first!");
            return;
        }

        const currentUrl = window.location.href;
        messageAdd(currentUrl + 'messages/add', channel, msg, user, () => this.socket.emit('message', msg, user, channel))

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



    // channel related functions

    isChannelActive = (toCheck, currentActive) => {
        return toCheck === currentActive;
    }

    updateChannels = (channels, setActive = this.state.activeChannel) => {
        this.setState({
            channels: this.state.channels.concat(channels)
        });

        this.setState({
            activeChannel: setActive
        });
    }

    addChannel(name, desc) {
        let newObjectInArray = [{name: name, description: desc}];

        this.setState({
            channels: this.state.channels.concat(newObjectInArray)
        });
    }

    switchActiveChannel = (toChannelIndex) => {
        if(toChannelIndex !== this.state.activeChannel) {
            const currentUrl = window.location.href;

            fetchMessages(currentUrl, this.state.channels[toChannelIndex]._id, (msgsObject) => this.renderMessages(msgsObject));

            this.setState({
                activeChannel: toChannelIndex,
                messages: []
            });
        }
    }

    // modals

    toggleModal = () => {
        const newBool = !this.state.channelAddModalVisible;

        this.setState({
            channelAddModalVisible: newBool
        });

        if(newBool) {
            $('body').addClass("dimmed");
        }
        else {
            $('body').removeClass("dimmed");
        }
    }

    render() {
        const user = this.props.userName;
        const message = this.state.messageBuffer;
        const messages = this.state.messages;
        const channels = this.state.channels;
        const activeChannel = this.state.activeChannel;
        const showModal = this.state.channelAddModalVisible;

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
                                        if(!c)
                                            return null;
                                        return <Channel key={i} onClick={e => selfReference.switchActiveChannel(i)} active={selfReference.isChannelActive(i, activeChannel)} 
                                                    name={c.name} description={c.description ? c.description : ''} />
                                    })
                                }
                            </div>
                        </div>
                        <div onClick={e => this.toggleModal()}>
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
                            <input value={message} type="text" onKeyUp={e => e.key === "Enter" ? this.messagePosted(message, user, channels[activeChannel]._id) : null} placeholder="Message..." onChange={ this.messageUpdated } />
                            <button className="ui button" onClick={e => this.messagePosted(message, user, channels[activeChannel]._id)}> Post </button>
                        </div>
                    </div>
                </div>

                <AddChannelModal addfn={this.addChannel} onClick={e => selfReference.toggleModal()} visible={showModal}/>
            </div>
        );
    }
}

export default Chat;