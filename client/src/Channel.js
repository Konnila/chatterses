import React, { Component } from "react";
import hashtagPic from './images/ht.png';

class Channel extends Component {
    render() {
        return(
            <div onClick={this.props.onClick} className={"item channel" + (this.props.active ? " active" : "")}>
                <img className="ui avatar image" alt="#" src={hashtagPic}/>
                <div className="content">
                    <a className="header">{this.props.name}</a>
                    <div className="description">
                        <span>{this.props.description}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Channel;