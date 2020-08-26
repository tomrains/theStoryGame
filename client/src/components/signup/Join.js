import React from 'react';

// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';

import { Link } from 'react-router-dom';

import axios from 'axios';

class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      playerName: null,
      playerAvatar: null,
      playerSubmitted: false,
    }
  }

  // updateName = (e) => {
  //   this.setState({ playerName: e.target.value });
  // }
  //
  // updateAvatar = (e) => {
  //   this.setState({ playerAvatar: e.target.value });
  // }

  // updateCode = (e) => {
  //   this.setState({ gameCode: e.target.value });
  // }

  putPlayer = (e) => {
    //don't submit information twice
    if (this.state.playerSubmitted) {
      return;
    }
    // e.preventDefault();
    let player = {
      name: this.props.playerName,
      avatar: this.props.playerAvatar
    }
    console.log(player);
    console.log(`the gameid in putPlayer is: ${this.props.gameId}`);
    axios.put(`http://localhost:4000/games/${this.props.gameId}`, player)
    .then(playerNumber => this.props.updatePlayerNumber(playerNumber.data))
    .then(this.setState({ playerSubmitted: true }));



  //   .then(console.log("we found the game!"));
  // this.props.updatePlayerNumber(playerNumber);

    // Add in something that takes the student number and puts it into the players state
  }

  getCodeFromURL = () => {
    const URL = window.location.href;
    const lengthOfURL = URL.length;
    let gameId = "";
    for (let i = 0; i < lengthOfURL; i++) {
      if (URL[i] === '?') {
        //leave loop
      }
      //add something about join
      else {
        gameId = gameId + URL[i];
      }
      if (gameId === "http://") {
        gameId = "";
      }
      else if (gameId === "localhost:3000") {
        gameId = "";
      }
      else if (gameId === "join") {
        gameId = "";
      }
      else if (gameId === "/") {
        gameId = "";
      }
      else {
        //nothing
      }
    }
    // console.log(gameId);
    // Check server for game - need to add error functionality to this
    axios.get(`http://localhost:4000/games/${gameId}`)
      //this should have an if statement. how do we do those?
      .then(res => this.props.howManyRounds(res.data[0].rounds));
    this.props.updateGameId(gameId);
  }

  componentDidMount() {
    this.getCodeFromURL();
  }

  render() {
    return <div>
    <h2> About to join game {this.props.gameId} </h2>
    <form>
      <div className="form-group">
        <label>Name</label>
        <input placeholder="Enter name" onChange={this.props.updateName} />
      </div>

      <div className="form-group">
        <label>Select avatar</label>
        <select multiple className="form-control" onChange={this.props.updateAvatar}>
          <option>Avatar 1</option>
          <option>Avatar 2</option>
          <option>Avatar 3</option>
          <option>Avatar 4</option>
          <option>Avatar 5</option>
        </select>
      </div>

      {!this.props.playerName || !this.props.playerAvatar ? (
        <button disabled type="button" className="btn btn-success">Join Game</button>
        ) : (
        <div>
          <button type="button"className="btn btn-success" onClick={this.putPlayer}>
            <Link to='/waitscreen'>Join Game</Link>
          </button>
        </div>
        )
      }
      </form>
    </div>;
  }
}

export default Join;
