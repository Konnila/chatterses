import React, { Component } from "react";
import avatar from './images/anon-avatar.jpg';

class Message extends Component {
    render() {
        return (
            <div> 
                <div className="ui list">
                    {/* make separate modules of channels */}
                    <div className="item">
                        <img className="ui avatar image" alt="#" src={avatar} />
                        <div className="content">
                            <strong className="header">{'<' + this.props.user + '>'}</strong>
                            <div className="description">
                                <span>{this.props.message}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <strong>{this.props.user}</strong> &nbsp;
                <span>{this.props.message}</span> */}
            </div>
        );
    }
}

export default Message;