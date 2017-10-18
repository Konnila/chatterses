import React, { Component } from "react";

import { channelAdd } from './Api';

class AddChannelModal extends Component {
    // This should be initialized in a constructor.
    state = {
        name: '',
        description: ''
    }

    addChannel = (name, description) => {
        const currentUrl = window.location.href;

        //this callbackFn given as props will update the listing of channels
        let callbackFn = this.props.addfn; // Weird props naming.
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
            // String interpolation can be used in className.
            // For example, `ui ${visible ? "active" : ""}`.
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
                        {/*    ^ This could be more readable as a separated handler, e.g. setName(). */}
                    </div>
                    <div className="field">
                        <label>
                            Channel description
                        </label>
                        <input onChange={e => this.setState({description: e.target.value})} placeholder="description" />
                        {/*    ^ This could be more readable as a separated handler, e.g. setDescription(). */}
                    </div>
                </div>
                <div className="actions">
                    <div className="ui red button" onClick={this.props.onClick}>Cancel</div>
                    <div className="ui green button" onClick={(e) => this.addChannel(name, description)} >Submit</div>
                    {/*                                        ^ parenthesis are not needed because lambda uses only one argument. */}
                </div>
            </div>
        );
    }
}

export default AddChannelModal;
