import React, { Component } from "react";
import Chat from "./Chat";

class App extends Component {
  state = {
    userName: ""
  };

  handleChangeUsername = e => {
    const value = e.target.value;

    this.setState({
      userName: value
    });
  }

  render() {
    // const { selectedFoods } = this.state;
    const userName = this.state.userName;
    return (
      <div className="App">
        
        <div className="ui container">
          <h2> Welcome to Chat App{userName !== '' ? ', ' + userName : ""}! </h2>
          <div className="ui top attached block header row">
            <div className="ui action labeled input">
              <div style={{backgroundColor: '#f3f4f5'}} className="ui label">
                Nickname
              </div>
              <input type="text" value={this.state.userName} onChange={this.handleChangeUsername}/>
              <div type="submit" className="ui violet button"> Change </div>
            </div>
          </div>

          <Chat userName={userName} />

        </div>
      </div>
    );
  }
}

export default App;
