import React from 'react';
import axios from 'axios';
// import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Form, Alert } from 'react-bootstrap';
import { BrowserRouter as Route, Link } from "react-router-dom";

import HelpModal from './HelpModal.js';
import Avatars from './Avatars.js';
// import JSEMOJI from 'emoji-js';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: null,
      playerAvatar: "Avatar 1",
      rounds: 3,
      gameIdUrl: null,
      test: null,
      playerSubmitted: false
    }
  }

  updateState = () => {
    this.props.removePreviousFinalStory();
    this.props.resetPlayerChoseAvatar();
    this.props.resetPlayerToDelete();
    this.props.resetRounds();
    this.props.resetPlayerName();
    this.props.resetPlayerId();
    this.props.updateHost();
    this.props.resetAppLevelRound();
    this.props.resetHasFinalStory();
    this.props.resetRemovablePlayers();
    this.props.resetAllPlayers();
  }

  componentDidMount() {
    this.updateState();
    this.gameURLGenerator();
  }

  updateName = (e) => {
    this.setState({ playerName: e.target.value });
  }

  updateAvatar = (e) => {
    this.setState({ playerAvatar: e.target.value });
  }

  updateRounds = (e) => {
    this.setState({ rounds: e.target.value });
  }

  deleteDefaultText = (e) => {
    // console.log("hey");
    if (e.target.value === "Enter 4-letter game code") {
      e.target.value = "";
    }
  }

  updateGameIdValue = (e) => {
    let gameId = e.target.value.toUpperCase();
    this.props.updateGameId(gameId);
    this.props.updateGameIdUrl(`secret-wildwood-99621.herokuapp.com/join/${gameId}`);
  }

  gameURLGenerator = () => {
    // this.props.updateHost(); //okay maybe this wasnt actually needed
    // console.log('hey');
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let gameIdUrl = `secret-wildwood-99621.herokuapp.com/join/${result}`;
    
    // let gameIdUrl = `secret-wildwood-99621.herokuapp.com/join/${result}`;

    // this.setState({ gameIdUrl: gameIdUrl });
    // this.setState({ gameId: result });
    this.props.updateGameId(result);
    this.props.updateGameIdUrl(gameIdUrl);
    // write a post request here
    let newGame = {
        code: result
    };
    // console.log("about to post a new game");
    // console.log(`the new game code is ${newGame.code}`);
    // axios.post('/add', newGame)
    // axios.post('http://localhost:4000/games/add', newGame)
    axios.post('/api/games/add', newGame)
        .then(res => console.log(res.data));
  }

  createGame = (e) => {
    if (this.state.playerSubmitted) {
      return;
    }
    // e.preventDefault();
    this.props.updateHost();
    let newGameInfo = {
        code: this.props.gameId,
        rounds: this.props.rounds,
        players: {
          name: this.props.playerName + " " + this.props.playerAvatar,
          number: 0,
          avatar: this.props.playerAvatar,
        }
    };
    // console.log(newGameInfo);
    axios.put('api/players/add/:code', newGameInfo)
    // axios.put('/add/:code', newGameInfo)
        .then(res => this.props.updatePlayerId(res.data.playerId));
        this.props.updatePlayerNumber(0);
        this.setState({ playerSubmitted: true });
  }


  render() {
      return (
        <div>
        <h1>Create a <b>Story Game</b> Private Party</h1>
        <hr />
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Your name</Form.Label>
            <Form.Control type="name" placeholder="Enter name" onChange={this.props.updateName}/>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Number of rounds</Form.Label>
            <Form.Control as="select" onClick={this.props.hostSetsRoundNumber}>
              <option>3</option>
              <option>5</option>
              <option>7</option>
              <option>9</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="emoji selector">
            <Form.Label>Select an emoji to represent you</Form.Label>
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
          )
        }

            {!this.props.playerName ||
              !this.props.playerAvatar ||
              !this.props.rounds ? (
                <Button variant="success" disabled>Create Game</Button>
              ) : (
              <div>
                <Link to='/waitscreen'>
                  <Button variant="success" onClick={this.createGame}>Create Game</Button>
                </Link>
              </div>
              )
            }
          <p>
          </p>
          <hr />
          <p>
            <HelpModal />
          </p>
        </div>
      )
    }
  }

export default HomeScreen;


{/* <hr />
          <h2>Joining a Game?</h2>
          <div className="form-group" controlId="exampleForm.ControlTextarea1">
                <p></p>
                  <textarea className="form-control" defaultValue="Enter 4-letter game code" onClick={this.deleteDefaultText} onChange={this.updateGameIdValue} ref={(textarea) => this.textArea = textarea}/>
            </div>
          <button class="btn btn-success">
            <Link to='/join'>Join</Link>
          </button>
          <p></p> */}