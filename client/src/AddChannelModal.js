import React, { Component } from "react";

import { channelAdd } from './Api';

class AddChannelModal extends Component {
    state = {
        name: '',
        description: ''
    }

    addChannel = (name, description) => {
        const currentUrl = window.location.href;

        //this callbackFn given as props will update the listing of channels
        let callbackFn = this.props.addfn;
        let toggleModelFn = this.props.onClick;

        //api call
        channelAdd(currentUrl + 'channels/add', name, description, callbackFn, toggleModelFn);
        this.clearData();
    }

    clearData = () => {
        this.setState({
            name: '',
            description: ''
        });
    }

    render() {
        const visible = this.props.visible;
        const name = this.state.name;
        const description = this.state.description;

        return(
            <div className={"ui" + (visible ? " active" : "") + " modal"}>
                <i className="close icon" onClick={this.props.onClick}></i>
                <div className="header">
                    Add a channel
                </div>
                <div className="ui form modal-form">
                    <div className="field">
                        <label>
                            Channel name
                        </label>
                        <input onChange={e => this.setState({name: e.target.value})} placeholder="name" />
                    </div>
                    <div className="field">
                        <label>
                            Channel description
                        </label>
                        <input onChange={e => this.setState({description: e.target.value})} placeholder="description" />
                    </div>
                </div>
                <div className="actions">
                    <div className="ui red button" onClick={this.props.onClick}>Cancel</div>
                    <div className="ui green button" onClick={(e) => this.addChannel(name, description)} >Submit</div>
                </div>
            </div>
        );
    }
}

export default AddChannelModal;