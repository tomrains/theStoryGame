import React from 'react';

import { Link } from 'react-router-dom';

// import { Button } from 'react-bootstrap';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      gameIdValue: ""
    }
  }

  deleteDefaultText = (e) => {
      console.log("hey");
    if (e.target.value === "Enter game code") {
      e.target.value = "";
    }
  }

  updateGameIdValue = (e) => {
    this.props.updateGameId(e.target.value);
  }

  updateGameIdNow = () => {
    console.log("hello");
    this.props.updateGameId(this.state.gameIdValue);
  }

  render() {
    //variables, logic and so on here
      return (
        <div>
          <button class="btn btn-success">
            <Link to='/home'>Create Game</Link>
          </button>
          <div>
          Enter code for existing game
          </div>
          <div className="form-group" controlId="exampleForm.ControlTextarea1">
                <p></p>
                  <textarea className="form-control" defaultValue="Enter game code" onClick={this.deleteDefaultText} onChange={this.updateGameIdValue} ref={(textarea) => this.textArea = textarea}/>
              </div>
          <button class="btn btn-success">
            <Link to='/join'>Join</Link>
          </button>
        </div>
      )
    }
  }

export default MainPage;
