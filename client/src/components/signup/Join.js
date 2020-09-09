import React from 'react';

import Avatars from '../welcomescreen/Avatars.js';
import { Button, Form } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import axios from 'axios';

class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      playerName: null,
      playerAvatar: null,
      playerSubmitted: false
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
      name: this.props.playerName + " " + this.props.playerAvatar,
      avatar: this.props.playerAvatar
    }
    console.log(player);
    console.log(`the gameid in putPlayer is: ${this.props.gameId}`);
    axios.put(`api/players/${this.props.gameId}`, player)
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
      else if (gameId === "secret-wildwood-99621.herokuapp.com") {
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
      let gameIdUrl = `secret-wildwood-99621.herokuapp.com/join/${gameId}`
      this.props.updateGameIdUrl(gameIdUrl);
    }
    console.log(gameId);
    // Check server for game - need to add error functionality to this
    axios.get(`api/${gameId}`)
      //this should have an if statement. how do we do those?
      // .then(res => console.log((res.data[0].rounds)));
      .then(res => this.props.howManyRounds(res.data[0].rounds));
    this.props.updateGameId(gameId);
  }

  componentDidMount() {
    this.getCodeFromURL();
  }

  render() {
    return <div>
    <h2> About to join game {this.props.gameId} </h2>

    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Name</Form.Label>
        <Form.Control type="name" placeholder="Enter name" onChange={this.props.updateName}/>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Select Avatar</Form.Label>
        <Route path="/join" render={(props) => (
          <Avatars {...props}
          updateAvatar = {this.props.updateAvatar} />
        )}
        />
      </Form.Group>
    </Form>

      {!this.props.playerName || !this.props.playerAvatar ? (
        <Button variant="success" disabled>Join Game</Button>
        ) : (
        <div>
          <Link to='/waitscreen'>
            <Button
              variant="success"
              onClick={this.putPlayer}>
              Join Game
            </Button>
          </Link>
        </div>
        )
      }
    </div>;
  }
}

export default Join;
