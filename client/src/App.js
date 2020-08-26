import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
import axios from 'axios';

import CreateGame from "./components/create-game.component";
import EditGame from "./components/edit-game.component";
// import GamesList from "./components/games-list.component";

//The real components
import WaitScreen from './components/gamecreation/subcomponents/WaitScreen.js';
import Join from './components/signup/subcomponents/Join.js'
import StoryConcealed from './components/storyconcealed/StoryConcealed.js';
import StoryRevealed from './components/storyrevealed/StoryRevealed.js';
import HomeScreen from './components/welcomescreen/HomeScreen.js';
import WritingPaper from './components/writingpaper/WritingPaper.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: null,
      gameIdUrl: null,
      gameIndex: null,
      players: [],
      playerName: "",
      playerAvatar: "Avatar1",
      playerNumber: null,
      rounds: null,
      currentRound: 1,
      doesGameIdExist: null,
      isHost: false,
      isLastRound: false,
      finalStory: null,
      hasFinalStory: false
    }
    this.updatePlayers = this.updatePlayers.bind(this);
  }

  // showURL = () => {
  //   const URL = window.location.href;
  //   const lengthOfURL = URL.length;
  //   let gameId = "";
  //   for (let i = 0; i < lengthOfURL; i++) {
  //     if (URL[i] === '?') {
  //       //leave loop
  //     }
  //     else {
  //       gameId = gameId + URL[i];
  //     }
  //     if (gameId === "http://") {
  //       gameId = "";
  //     }
  //     else if (gameId === "localhost:3000") {
  //       gameId = "";
  //     }
  //     else if (gameId === "/") {
  //       gameId = "";
  //     }
  //     else {
  //       //nothing
  //     }
  //   }
  //   if (gameId === "") {
  //     console.log("looks like we're on a homepage/create game page");
  //     this.setState({ isHost: true });
  //     return;
  //   }
  //   // console.log(gameId);
  //   this.setState({ gameId: gameId })
  //   //so now it should look for this gameCode on the backend to see if it exists
  //   axios.get('/gameId', {
  //     params: {
  //       gameId: gameId
  //     }
  //   })
  //   .then((doesGameIdExist) => console.log(doesGameIdExist.config.params))
  //   .then(this.setState({ homeScreen: false }))
  //   .then(this.setState({ join: true }))
  //   .then(this.setState({ isHost: false }))
  // };

  // Fetch the list on first mount
  componentDidMount() {
    // this.showURL();
    // axios.get('/userSessions');
    // axios.get('/tryme');
  }


  updatePlayers = () => {
    axios.get('/signup')
    .then(playerInfo => this.setState({ players: playerInfo.data }))
    console.log(this.state.players)
  }

  updateGameId = (gameId) => {
    this.setState({ gameId: gameId })
  }

  updateGameIdUrl = (gameIdUrl) => {
    this.setState({ gameIdUrl: gameIdUrl })
  }

  updateHost = () => {
    this.setState({ isHost: true })
  }

  updateRoundNumber = () => {
    if (this.state.rounds - this.state.currentRound === 1) {
      this.setState({ isLastRound: true})
    }
    this.setState({ currentRound: this.state.currentRound + 1 })
  }

  updatePlayerNumber = (playerNumber) => {
    this.setState({ playerNumber: playerNumber })
  }

  howManyRounds = (rounds) => {
    this.setState({ rounds: rounds })
  }

  hostSetsRoundNumber = (e) => {
    this.setState({ rounds: e.target.value })
  }

  updateName = (e) => {
    this.setState({ playerName: e.target.value });
  }

  updateAvatar = (e) => {
    this.setState({ playerAvatar: e.target.value })
  }

  updateFinalStory = (finalStory) => {
    this.setState({ finalStory: finalStory })
  }

  updateHasFinalStory = () => {
    this.setState({ hasFinalStory: true })
  }

  startGame = () => {
    if (this.state.isHost) {
      axios.put(`http://localhost:4000/games/${this.state.gameId}/startGame`)
    }
    else {
      return;
    }
  }


  render() {
    return (
      <Router>
        <div className="container">
          <br/>
          <Route path="/edit/:id" component={EditGame} />
          <Route path="/create" component={CreateGame} />
          <Route
            path="/waitscreen"
            render={(props) => (
              <WaitScreen {...props}
              startGame={this.startGame}
              players={this.state.players}
              test1 = {this.test1}
              gameIdUrl = {this.state.gameIdUrl}
              gameId = {this.state.gameId}
              isHost = {this.state.isHost}
              updateGameIdUrl = {this.updateGameIdUrl}
              updateHost = {this.updateHost}
              playerNumber = {this.state.playerNumber}
              playerName = {this.state.playerName}
              playerAvatar = {this.state.playerAvatar}
              rounds = {this.state.rounds} />
            )}
          />
          <Route path="/join" render={(props) => (
            <Join {...props}
            state={this.state}
            gameIdUrl = {this.state.gameIdUrl}
            gameId = {this.state.gameId}
            updateGameId = {this.updateGameId}
            updateGameIdUrl = {this.updateGameIdUrl}
            updatePlayerNumber = {this.updatePlayerNumber}
            howManyRounds = {this.howManyRounds}
            playerName = {this.state.playerName}
            playerAvatar = {this.state.playerAvatar}
            updateName = {this.updateName}
            updateAvatar = {this.updateAvatar} />
            )}
          />
          <Route path="/lab" render={(props) => (
            <StoryConcealed {...props}
            test1 = {this.test1}
            playerNumber = {this.state.playerNumber} />
          )}
          />
          <Route path="/story" render={(props) => (
            <StoryRevealed {...props}
            test1 = {this.test1}
            playerNumber = {this.state.playerNumber}
            finalStory = {this.state.finalStory}
            isHost={this.state.isHost}
            playerName = {this.state.playerName}
            playerAvatar = {this.state.playerAvatar} />
          )}
          />
          <Route exact path="/" render={(props) => (
            <HomeScreen {...props}
            gameIdUrl = {this.state.gameIdUrl}
            updateGameId = {this.updateGameId}
            isHost = {this.props.isHost}
            gameId = {this.state.gameId}
            updateGameIdUrl = {this.updateGameIdUrl}
            updatePlayerNumber = {this.updatePlayerNumber}
            howManyRounds = {this.howManyRounds}
            rounds = {this.state.rounds}
            updateName = {this.updateName}
            updateAvatar = {this.updateAvatar}
            updateHost = {this.updateHost}
            playerNumber = {this.state.playerNumber}
            playerName = {this.state.playerName}
            playerAvatar = {this.state.playerAvatar}
            hostSetsRoundNumber = {this.hostSetsRoundNumber}
            />
          )}
          />
          <Route path="/writing" render={(props) => (
            <WritingPaper {...props}
            currentRound={this.state.currentRound}
            isHost={this.state.isHost}
            updateRoundNumber={this.updateRoundNumber}
            playerNumber = {this.state.playerNumber}
            gameId = {this.state.gameId}
            isLastRound = {this.state.isLastRound}
            rounds = {this.state.rounds}
            finalStory = {this.state.finalStory}
            updateFinalStory = {this.updateFinalStory}
            hasFinalStory={this.state.hasFinalStory}
            updateHasFinalStory={this.updateHasFinalStory} />
          )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
