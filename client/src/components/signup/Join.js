import React from 'react';

import Avatars from '../welcomescreen/Avatars.js';
import { Button, Form, Alert } from 'react-bootstrap';
import { BrowserRouter as Route, Link } from "react-router-dom";

import axios from 'axios';

class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
      playerName: null,
      playerAvatar: null,
      playerSubmitted: false,
      gameHasStarted: null,
      doesGameExist: true
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

  // putPlayer = (e) => {
  //   //don't submit information twice
  //   if (this.state.playerSubmitted) {
  //     return;
  //   }
  //   // e.preventDefault();
  //   let player = {
  //     name: this.props.playerName + " " + this.props.playerAvatar,
  //     avatar: this.props.playerAvatar
  //   }
  //   console.log(player);
  //   console.log(`the gameid in putPlayer is: ${this.props.gameId}`);
  //   axios.put(`api/players/${this.props.gameId}`, player)
  //   .then(res => this.props.updatePlayerNumber(res.data.playerNumber))
  //   .then(this.setState({ playerSubmitted: true }));



  // //   .then(console.log("we found the game!"));
  // // this.props.updatePlayerNumber(playerNumber);

  //   // Add in something that takes the student number and puts it into the players state
  // }

  updateState = () => {
    this.props.removeHostStatus();
    this.props.removePreviousFinalStory();
    this.props.resetPlayerChoseAvatar();
    this.props.resetPlayerToDelete();
    this.props.resetRounds();
    this.props.resetPlayerName();
    this.props.resetPlayerId();
    this.props.resetAppLevelRound();
    this.props.resetHasFinalStory();
    this.props.resetRemovablePlayers();
    this.props.resetAllPlayers();
  }

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
    .then((res) => {
      this.props.updatePlayerNumber(res.data.playerNumber);
      this.props.updatePlayerId(res.data.playerId);
    });
  }

  // updatePlayerNumber = () => {
  //   console.log("hey");
  // }

  // updatePlayerId = () => {
  //   console.log("hey again");
  // }

  getCodeFromURL = () => {
    if (this.props.gameId !== "" && this.props.gameId !== null) { //recently added lines of code
      console.log("there's already a gameId, so you probably came here from the homepage");
      this.grabGameInfo(this.props.gameId);
      return;
    }
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
    }
    gameId = gameId.toUpperCase();
    if (gameId.length > 4) {
      gameId = gameId.slice(0, 4);
    }
    let gameIdUrl = `secret-wildwood-99621.herokuapp.com/join/${gameId}`;
    this.props.updateGameIdUrl(gameIdUrl);
    console.log(gameId);
    // Check server for game - need to add error functionality to this
    this.props.updateGameId(gameId);
    this.grabGameInfo(gameId);
  }

  grabGameInfo = (gameId) => {
    console.log(`the game id is ${gameId}`);
    axios.get(`/join/api/${gameId}`)
      //this should have an if statement. how do we do those?
      // .then(res => console.log((res.data[0].rounds)));
      .then((res) => {
        console.log(`the data from the backend is ${res.data}`);
        console.log(`the data from the backend is ${res.data[0]}`);
        console.log(`the data from the backend is ${res.data[0].rounds}`);
        console.log(`the data from the backend is ${res.data[0].gameStarted}`);
        console.log(`the data from the backend is ${res.data[0].doesGameExist}`);
        this.props.howManyRounds(res.data[0].rounds);
        this.hasGameStarted(res.data[0].gameStarted);
        this.doesGameExist(res.data[0].doesGameExist);
      });
  }

  componentDidMount() { 
    this.updateState(); //switched order of these 2
    this.getCodeFromURL();
  }

  doesGameExist = (doesGameExist) => {
    if (doesGameExist === false) {
      this.setState({ doesGameExist: false });
    }
  }

  hasGameStarted = (hasStarted) => {
    if (hasStarted === true) {
      this.setState({ gameHasStarted: true });
    }
  }

  render() {
    return <div>

    {this.state.gameHasStarted || !this.state.doesGameExist ? (
        <div>
          Oops! Either this game has already started, or it doesn't exist.
          <p></p>
          <p>
            <Link to='/'>
              <Button
                variant="success">
                Return Home
              </Button>
            </Link>
          </p>
        </div>
    ) : (

      <div>

      <h2> About to join game {this.props.gameId} </h2>

    <Form>
      <Form.Group controlId="exampleForm.ControlInput1">
        <Form.Label>Name</Form.Label>
        <Form.Control type="name" placeholder="Enter name" onChange={this.props.updateName}/>
      </Form.Group>
      <Form.Group controlId="emoji selector">
            <Form.Label>Select emoji as your avatar</Form.Label>
              <Avatars
              updateAvatar = {this.props.updateAvatar} 
              />
          </Form.Group>
        </Form>

    

    {this.props.playerChoseAvatar ? (
    <Alert variant="primary" transition="fade">
      {this.props.playerAvatar} selected
    </Alert>
    ) : (
      <div>
      </div>
    )}


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
      </div>





    )
  
  }
    </div>;




  }
}

export default Join;
