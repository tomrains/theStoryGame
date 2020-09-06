import React from 'react';
import axios from 'axios';
// import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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

  componentDidMount() {
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

  gameURLGenerator = () => {
    // this.props.updateHost(); //okay maybe this wasnt actually needed
    console.log('hey');
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let gameIdUrl = `secret-wildwood-99621.herokuapp.com/join/${result}`
    // this.setState({ gameIdUrl: gameIdUrl });
    // this.setState({ gameId: result });
    this.props.updateGameId(result);
    this.props.updateGameIdUrl(gameIdUrl);
    // write a post request here
    let newGame = {
        code: result
    };
    console.log("about to post a new game");
    console.log(`the new game code is ${newGame.code}`);
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
    console.log(newGameInfo);
    axios.put('api/players/add/:code', newGameInfo)
    // axios.put('/add/:code', newGameInfo)
        .then(res => console.log(res.data));
        this.props.updatePlayerNumber(0);
        this.setState({ playerSubmitted: true });
  }


  render() {
      return (
        <div>
        <h1>The Story Game</h1>
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" placeholder="Enter name" onChange={this.props.updateName}/>
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Number of Rounds</Form.Label>
            <Form.Control as="select" onClick={this.props.hostSetsRoundNumber}>
              <option>3</option>
              <option>5</option>
              <option>7</option>
              <option>9</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>Select Avatar</Form.Label>
            <Route path="/" render={(props) => (
              <Avatars {...props}
              updateAvatar = {this.props.updateAvatar} />
            )}
            />
          </Form.Group>
          
        </Form>
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
          <p>
            <HelpModal />
          </p>
        </div>
      )
    }
  }

export default HomeScreen;

//i kinda like idea of you pressign the create game button, and then it leads...
//..you to the screen with the URL and the like
