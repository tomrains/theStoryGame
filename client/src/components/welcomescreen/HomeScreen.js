import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

import HelpModal from './HelpModal.js'

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: null,
      playerAvatar: null,
      rounds: null,
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
    e.preventDefault();
    this.props.updateHost();
    let newGameInfo = {
        code: this.props.gameId,
        rounds: this.props.rounds,
        players: {
          name: this.props.playerName,
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
        <h1>Welcome to the Story Game! Ready to start a game with friends?</h1>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input type="name" placeholder="Enter name" onChange={this.props.updateName} />
            </div>

            <div className="form-group">
              <label>Select avatar</label>
              <select multiple className="form-control" onClick={this.props.updateAvatar}>
                <option>Avatar 1</option>
                <option>Avatar 2</option>
                <option>Avatar 3</option>
                <option>Avatar 4</option>
                <option>Avatar 5</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of rounds</label>
              <select multiple className="form-control" onClick={this.props.hostSetsRoundNumber}>
                <option>3</option>
                <option>5</option>
                <option>7</option>
                <option>9</option>
              </select>
            </div>

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

          </form>
          <HelpModal />
        </div>
      )
    }
  }

export default HomeScreen;

//i kinda like idea of you pressign the create game button, and then it leads...
//..you to the screen with the URL and the like
