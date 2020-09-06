import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
import axios from 'axios';

//The real components
import WaitScreen from './components/gamecreation/WaitScreen.js';
import Join from './components/signup/Join.js'
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
      playerAvatar: "🤠",
      playerNumber: null,
      rounds: 3,
      doesGameIdExist: null,
      isHost: false,
      finalStory: null,
      hasFinalStory: false
    }
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

  // updateRoundNumber = (number) => {
  //   if (this.state.rounds - this.state.currentRound === 0) { //changed this from 1 to 0
  //     this.setState({ isLastRound: true})
  //   }
  //   this.setState({ currentRound: number })
  // }

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

  updateAvatar = (avatar) => {
    this.setState({ playerAvatar: avatar }) //changed this from e.target.value
  }

  updateFinalStory = (finalStory) => {
    this.setState({ finalStory: finalStory })
  }

  updateHasFinalStory = () => {
    this.setState({ hasFinalStory: true })
  }

  startGame = () => {
    if (this.state.isHost) {
      axios.put(`api/games/${this.state.gameId}/startGame`)
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
            isHost={this.state.isHost}
            updateRoundNumber={this.updateRoundNumber}
            playerNumber = {this.state.playerNumber}
            gameId = {this.state.gameId}
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
