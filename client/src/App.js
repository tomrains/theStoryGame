import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SimpleStorage from "react-simple-storage";

import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
import axios from 'axios';

//The real components
import WaitScreen from './components/gamecreation/WaitScreen.js';
import Join from './components/signup/Join.js'
import StoryRevealed from './components/storyrevealed/StoryRevealed.js';
import HomeScreen from './components/welcomescreen/HomeScreen.js';
import WritingPaper from './components/writingpaper/WritingPaper.js';
import MainPage from './components/mainpage/MainPage.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: null,
      gameIdUrl: null,
      gameIndex: null,
      players: [],
      allPlayers: [],
      playerName: "",
      playerAvatar: "🤠",
      playerNumber: null,
      playerId: null,
      rounds: 3,
      appLevelRound: 1,
      doesGameIdExist: null,
      isHost: false,
      finalStory: null,
      hasFinalStory: false,
      playerChoseAvatar: false,
      playerToDelete: null
    }
  }

  removePreviousFinalStory = () => {
    this.setState({ finalStory: null });
  }

  resetPlayerChoseAvatar = () => {
    this.setState({ playerChoseAvatar: false });
  }

  resetPlayerToDelete = () => {
    this.setState({ playerToDelete: null });
  }

  resetRounds = () => {
    this.setState({ rounds: 3 });
  }

  resetPlayerName = () => {
    this.setState({ playerName: null });
  }

  resetAppLevelRound = () => {
    this.setState({ appLevelRound: 1 });
  }

  updateGameId = (gameIdValue) => {
    this.setState({ gameId: gameIdValue })
  }

  updateGameIdUrl = (gameIdUrl) => {
    this.setState({ gameIdUrl: gameIdUrl })
  }

  updateHost = () => {
    this.setState({ isHost: true })
  }

  removeHostStatus = () => {
    this.setState({ isHost: false });
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

  updatePlayerId = (playerId) => {
    this.setState({ playerId: playerId })
  }

  howManyRounds = (rounds) => {
    this.setState({ rounds: rounds })
  }

  hostSetsRoundNumber = (e) => {
    this.setState({ rounds: e.target.value });
    console.log("howdy");
  }

  updateName = (e) => {
    this.setState({ playerName: e.target.value });
  }

  updateAvatar = (avatar) => {
    this.setState({ playerAvatar: avatar }); //changed this from e.target.value
    this.setState({ playerChoseAvatar: true}); //this make the alert show up
  }

  updateFinalStory = (finalStory) => {
    this.setState({ finalStory: finalStory })
  }

  updateHasFinalStory = () => {
    this.setState({ hasFinalStory: true })
  }

  updateAllPlayers = (info) => {
    this.setState({ allPlayers: info });
  }

  updatePlayerToDelete = (e) => {
    if (e.target.name === this.state.playerToDelete) {
      this.setState({ playerToDelete: null });
    }
    else {
      this.setState({ playerToDelete: e.target.name })
    }
  }

  removePlayer = (round) => {
    // console.log("remove player");
    // console.log(e);
    // console.log(e.target);
    // console.log(e.target.className);
    // console.log(e.target.name);
    // console.log(e.target.type);
    // console.log(e.target.id);
    // console.log(e.target.playernumber);
    // console.log(e.target.playerId);
    // let info = {
    //   playerId: this.state.playerToDelete,
    // }
    axios.put(`api/players/delete/${this.state.gameId}/${this.state.appLevelRound}/${this.state.playerToDelete}`)
        .then(res => this.setState({ allPlayers: res.data[0].players })); 
        // .then(res => console.log(res));
  }

  startGame = () => {
    if (this.state.isHost) {
      axios.put(`api/games/${this.state.gameId}/startGame`)
    }
    else {
      return;
    }
  }

  updateAppLevelRound = () => {
    this.setState({ appLevelRound: this.state.appLevelRound + 1 });
  }


  render() {
    return (
      <Router>
        <div className="container">
          <SimpleStorage parent={this} />
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
              rounds = {this.state.rounds} 
              updateAllPlayers = {this.updateAllPlayers}
              />
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
            updatePlayerId = {this.updatePlayerId}
            howManyRounds = {this.howManyRounds}
            playerName = {this.state.playerName}
            playerAvatar = {this.state.playerAvatar}
            updateName = {this.updateName}
            updateAvatar = {this.updateAvatar}
            playerChoseAvatar = {this.state.playerChoseAvatar}
            removeHostStatus = {this.removeHostStatus}
            removePreviousFinalStory = {this.removePreviousFinalStory}
            resetPlayerChoseAvatar = {this.resetPlayerChoseAvatar}
            resetPlayerToDelete = {this.resetPlayerToDelete}
            resetRounds = {this.resetRounds}
            resetPlayerName = {this.resetPlayerName}
            resetAppLevelRound = {this.resetAppLevelRound}
            />
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
          <Route path="/home" render={(props) => (
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
            playerChoseAvatar = {this.state.playerChoseAvatar}
            hostSetsRoundNumber = {this.hostSetsRoundNumber}
            removePreviousFinalStory = {this.removePreviousFinalStory}
            resetPlayerChoseAvatar = {this.resetPlayerChoseAvatar}
            resetPlayerToDelete = {this.resetPlayerToDelete}
            resetRounds = {this.resetRounds}
            resetPlayerName = {this.resetPlayerName}
            resetAppLevelRound = {this.resetAppLevelRound}
            />
          )}
          />
          <Route exact path="/" render={(props) => (
            <MainPage {...props}
            updateGameId = {this.updateGameId}
            />
          )}
          />
          <Route path="/writing" render={(props) => (
            <WritingPaper {...props}
            isHost={this.state.isHost}
            updateRoundNumber={this.updateRoundNumber}
            playerNumber = {this.state.playerNumber}
            updatePlayerNumber = {this.updatePlayerNummber}
            gameId = {this.state.gameId}
            rounds = {this.state.rounds}
            finalStory = {this.state.finalStory}
            updateFinalStory = {this.updateFinalStory}
            hasFinalStory={this.state.hasFinalStory}
            updateHasFinalStory={this.updateHasFinalStory}
            allPlayers = {this.state.allPlayers}
            removePlayer = {this.removePlayer}
            playersToDelete = {this.playersToDelete}
            updatePlayerToDelete = {this.updatePlayerToDelete}
            updateAllPlayers = {this.updateAllPlayers}
            playerName = {this.state.playerName}
            updateAppLevelRound = {this.updateAppLevelRound}
            appLevelRound = {this.state.appLevelRound}
            />
          )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
