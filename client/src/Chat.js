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

        // Change this callback to lambda so you can get rid off
        // unneccessary variables (namely, renderFunction).
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

        // This is bad because it modifies state without setState(..) call.
        // It is because you get an array reference and push 'newEntry' to
        // that very same reference.
        updatedMessages.push(newEntry);

        // You should use a state change function here because new state
        // depends on previous state. Also, you should create a new
        // array reference when updating state, like this:
        //    previvousState.messages.concat([newEntry]).
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

            // Same thing as above: you modify the existing state.
            updatedMessages.push(entry);
        }

        // Same thing as above: use a state change function and create a new array reference.
        this.setState({
            messages: updatedMessages
        });
    }

    messagePosted = (msg, user, channel) => {
        if(!user || user === '') {
            // alert() is kind of... not very nice.
            alert("Select username first!");
            return;
        }

        const currentUrl = window.location.href;
        messageAdd(currentUrl + 'messages/add', channel, msg, user, () => this.socket.emit('message', msg, user, channel)) // Emit here?
        //                                                                                                                ^ semicolon is missing.
        this.socket.emit('message', msg, user, channel); // And emit here, reason?

        // State change function could be a good practice here also since
        // change depends on side effects.
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

        // This should use state change function since new state
        // depends on the previous state.
        this.setState({
            channels: this.state.channels.concat(channels)
        });

        this.setState({
            activeChannel: setActive
        });
    }

    addChannel(name, desc) {
        let newObjectInArray = [{name: name, description: desc}];

        // This should use state change function since new state
        // depends on the previous state.
        this.setState({
            channels: this.state.channels.concat(newObjectInArray)
        });
    }

    switchActiveChannel = (toChannelIndex) => {
        if(toChannelIndex !== this.state.activeChannel) {
            const currentUrl = window.location.href;

            fetchMessages(currentUrl, this.state.channels[toChannelIndex]._id, (msgsObject) => this.renderMessages(msgsObject));

            // This should also use state change function because new state depends
            // on 'activeChannel' current state property.
            this.setState({
                activeChannel: toChannelIndex,
                messages: []
            });
        }
    }

    // modals

    toggleModal = () => {
        const newBool = !this.state.channelAddModalVisible;

        // You assume here that the previous state is the current one.
        // This may not always be the case if state changes are chained
        // together.
        this.setState({
            channelAddModalVisible: newBool
        });

        // Here you update the view with the same assumption.
        if(newBool) {
            $('body').addClass("dimmed");
        }
        else {
            $('body').removeClass("dimmed");
        }

        // You could use state change function and
        // timeout trick to apply view updates to make
        // this a bit more robust. Like so:
        // this.setState(prevState => {
        //    const visible = !prevState.channelAddModalVisible;
        //    setTimeout(() => visible ? $('body').addClass("dimmed") : $('body').removeClass("dimmed"), 0);
        //    return ({ channelAddModalVisible: visible }));
        // });
        //
        // This will ensure that side-effects happen alongside with the state update.
    }

    render() {
        const user = this.props.userName;
        const message = this.state.messageBuffer;
        const messages = this.state.messages;
        const channels = this.state.channels;
        const activeChannel = this.state.activeChannel;
        const showModal = this.state.channelAddModalVisible;

        // This is not needed since JS lambda captures this
        // reference. Another approach is to (re)bind function
        // like so: (function () {}).bind(this);
        var selfReference = this;

        return (
            <div>
                {/* container for messages */}
                <div id="messages-container" className="ui two column grid row">
                    <div className="four wide column">
                        <div id="channels">
                            <div className="ui list">
                                {
                                    // This would be readable if this is stored to a
                                    // separated variable and then only the variable is
                                    // rendered here.
                                    channels.map(function (c, i) {
                                        if(!c)
                                            return null;

                                        // You could try to make this more readable by identing props like so:
                                        // <Channel key={...}
                                        //          onClick={...}
                                        //          ... />
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
                            // This also would be more readable if it is stored to a separated variable.
                            messages.map(function (entry, i){
                                return <Message key={i} user={entry.user} message={entry.message} />
                            })
                        }
                        </div>

                        <div className="ui action input row" id="chat-message-input">
                            <input value={message} type="text" onKeyUp={e => e.key === "Enter" ? this.messagePosted(message, user, channels[activeChannel]._id) : null} placeholder="Message..." onChange={ this.messageUpdated } />
                            {/*                                ^ This definitely needs its own function. */}
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
