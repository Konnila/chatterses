import React, { Component } from "react";

class Message extends Component {
    render() {
        return (
            <div> 
                <strong>{this.props.user}</strong> &nbsp;
                <span>{this.props.message}</span>
            </div>
        );
    }
}

export default Message;