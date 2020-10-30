import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SimpleStorage from "react-simple-storage";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
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
      allPlayers: [{name: "Loading Players", _id: "Test ID"}],
      removablePlayers: [{name: "Loading Players", _id: "Test ID"}],
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
      playerToDelete: null,
      playerNumberToDelete: null
    }
  }

  removePlayer = (round) => {
    let newRemovablePlayers = [];
    // console.log(`newRemovablePlayers is ${newRemovablePlayers}`);
    for (let i = 0; i < this.state.removablePlayers.length; i++) {
      if (i !== this.state.playerNumberToDelete - 1) {
        newRemovablePlayers.push(this.state.removablePlayers[i]);
        // console.log(`newRemovablePlayers is now ${newRemovablePlayers}`);
      }
    }
    // console.log(`newRemovablePlayers is finally ${newRemovablePlayers}`);
    this.setState({ removablePlayers: newRemovablePlayers });
    axios.put(`api/players/delete/${this.state.gameId}/${this.state.appLevelRound}/${this.state.playerToDelete}`)
        .then(res => this.setState({ 
          allPlayers: res.data[0].players,
          playerToDelete: null,
          playerNumberToDelete: null
          //add in something to update removablePlayers
          //maybe get the number of the deletedPlayer and remove that from the remoavlePlayers array?
         })
          );
    // this.updateRemovablePlayers();

        // .then(res => console.log(res));
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

  resetPlayerId = () => {
    this.setState({ playerId: null });
  }

  resetAppLevelRound = () => {
    this.setState({ appLevelRound: 1 });
  }

  resetHasFinalStory = () => {
    this.setState({ hasFinalStory: false });
  }

  resetRemovablePlayers = () => {
    this.setState({ removablePlayers: [{name: "Loading Players", _id: "Test ID"}]});
  }

  resetAllPlayers = () => {
    this.setState({ allPlayers: [] });
  }


  updateGameId = (gameIdValue) => {
    this.setState({ gameId: gameIdValue });
  }

  updateGameIdUrl = (gameIdUrl) => {
    // console.log(`the gameIdUrl is ${gameIdUrl}`);
    this.setState({ gameIdUrl: gameIdUrl });
  }

  updateHost = () => {
    this.setState({ isHost: true });
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
    // console.log("howdy");
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

  // updateRemovablePlayers = (info, boolean) => {
  //   if (boolean) {
  //     let removablePlayers = info.shift();
  //     this.setState({ removablePlayers: removablePlayers});
  //   }
  //   else {
  //     this.setState({ removablePlayers: info });
  //   }
  // }

  updateRemovablePlayers = (playerInfo) => {
    // if (this.state.allPlayers === [] || !this.state.allPlayers || this.state.allPlayers === undefined) {
    //   return;
    // }
    if (playerInfo) {
      // console.log("we got some player info!");
      let removablePlayers = [];
      for (let i = 1; i < playerInfo.length; i++) {
        removablePlayers.push(playerInfo[i]);
        // console.log(`removablePlayers is now ${removablePlayers}`);
      }
      // console.log(`OUT OF THE LOOP. removablePlayers is now ${removablePlayers}`);
      this.setState({ removablePlayers: removablePlayers });
    }
    else {
      let removablePlayers = [];
      for (let i = 1; i < this.state.allPlayers.length; i++) {
        removablePlayers.push(this.state.allPlayers[i]);
        // console.log(`removablePlayers is now ${removablePlayers}`);
      }
      // console.log(`OUT OF THE LOOP. removablePlayers is now ${removablePlayers}`);
      this.setState({ removablePlayers: removablePlayers });
    }
    this.updatePlayerToDelete(false, this.state.removablePlayers[0]);
  }

  updatePlayerToDelete = (e, playerNumber) => {
    // console.log("wer're in UpdatePlayerToDelete");
    // console.log(e);
    // console.log(playerNumber);
    // console.log(e.target.funtime);
    // console.log(e.target.className);
    // console.log(e.target.type);
    if (e && playerNumber) {
      // console.log("there is an e and playerNumber");
      // console.log(e);
      // console.log(e.target);
      // console.log(e.target.id);
      playerNumber = parseInt(playerNumber);
      // console.log(playerNumber);
      this.setState({ 
      playerToDelete: e.target.id,
      playerNumberToDelete: playerNumber 
      });
    }
    else if (!e && playerNumber) { // If you've just deleted a player and want to update the Removable Players
    // console.log("there is no e, but there is a playerNumber");
      this.setState({ 
        playerToDelete: null,
        playerNumberToDelete: null
      }); 
    }
    else if (!e && !playerNumber) { // If you close the Modal, this happens
      if (this.state.playerToDelete === null && this.state.playerNumberToDelete === null) {
        return;
      }
      // console.log("there isn't an e or a playerNumber");
      this.setState({ 
        playerToDelete: null,
        playerNumberToDelete: null
      }); 
    }
    else {
      // console.log("theres no playerNumber");
      return;
    }
    // console.log(e.target);
    // if (e.target.id === this.state.playerToDelete) {
    //   this.setState({ 
    //     playerToDelete: null,
    //     playerNumberToDelete: null 
    //   });
    // }
    // else {
    // }
  }

  startGame = () => {
    this.updateRemovablePlayers();
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
              updateRemovablePlayers = {this.updateRemovablePlayers}
              allPlayers={this.state.allPlayers}
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
            resetHasFinalStory = {this.resetHasFinalStory}
            resetPlayerId = {this.resetPlayerId}
            resetRemovablePlayers = {this.resetRemovablePlayers}
            resetAllPlayers = {this.resetAllPlayers}
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
          <Route exact path="/" render={(props) => (
            <HomeScreen {...props}
            gameIdUrl = {this.state.gameIdUrl}
            updateGameId = {this.updateGameId}
            isHost = {this.props.isHost}
            gameId = {this.state.gameId}
            updateGameIdUrl = {this.updateGameIdUrl}
            updatePlayerNumber = {this.updatePlayerNumber}
            updatePlayerId = {this.updatePlayerId}
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
            resetHasFinalStory = {this.resetHasFinalStory}
            resetPlayerId = {this.resetPlayerId}
            resetRemovablePlayers = {this.resetRemovablePlayers}
            resetAllPlayers = {this.resetAllPlayers}
            />
          )}
          />
          <Route exact path="/backUpHome" render={(props) => (
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
            removablePlayers = {this.state.removablePlayers}
            updateRemovablePlayers = {this.updateRemovablePlayers}
            resetPlayerToDelete = {this.resetPlayerToDelete}
            />
          )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
