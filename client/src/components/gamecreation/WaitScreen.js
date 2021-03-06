import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./waitscreen.css";
import { Button } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';

import { CopyToClipboard } from 'react-copy-to-clipboard';

class WaitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: "Default",
      gameStarted: false,
      copySuccess: '',
      copied: false,
      removablePlayers: "Default"
    }
  }

  intervalID;

  componentDidMount() {
    this.getPlayers();
    // pausing for now so it stops fetching lol
    this.intervalID = setInterval(this.getPlayers.bind(this), 3000);
  }

  // updateRounds = (e) => {
  //   console.log("lets update those rounds");
  //   this.setState ({ rounds: e.target.value })
  // }

//   copy = (e) => {
//   /* Get the text field */
//   let copyText = this.props.gameIdUrl;
//   // console.log(e.target.value);
//   /* Select the text field */
//   // console.log(copyText);
//   copyText[0].select();
//   copyText.setSelectionRange(0, 99999); /*For mobile devices*/

//   /* Copy the text inside the text field */
//   document.execCommand("copy");

//   /* Alert the copied text */
//   alert("Copied the text: " + copyText.value);
// }

copyCodeToClipboard = () => {
  const el = this.textArea
  el.select()
  document.execCommand("copy")
}

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  //this only works if you let it do the interval thing
  getPlayers = () => {
    //this shows undefined
    if (this.props.gameId) {
      console.log(`This.props.gameId is: ${this.props.gameId}`);
      // axios.get(`http://localhost:4000/games/${this.props.gameId}/players`)
      axios.get(`api/players/${this.props.gameId}/player`)
        // .then(game => this.setState({ gameInfo: game.data[0].players }));
        .then(game => this.updateAllTheThings(game));
        // .then(game => this.setState({
        //   gameInfo: game.data[0].players,
        //   gameStarted: game.data[0].gameStarted,
        //   // removablePlayers: game.data[0].removablePlayers
        // }));
        // console.log(this.state.gameInfo);
        // this.props.updateAllPlayers(this.state.gameInfo);
        // this.props.updateRemovablePlayers();
        // this.props.updateRemovablePlayers();
    }
  }

  updateAllTheThings = (game) => {
    this.props.updateAllPlayers(game.data[0].players);
    this.props.updateRemovablePlayers();
    this.setState({ gameStarted: game.data[0].gameStarted });
  }

  // beginGame = (e) => {
  //   this.props.updateRemovablePlayers();
  //   // e.preventDefault();
  //   console.log("begin game functionality will go here");
  //   //do a put request to server to begin game
  //   let gameStatus = {
  //     gameStatus: true
  //   }
  //   axios.put(`api/games/${this.props.gameId}/startGame`, gameStatus)
  // }

//   copyToClipboard = (e) => {
//   this.textArea.select();
//   document.execCommand('copy');
//   // This is just personal preference.
//   // I prefer to not show the whole text area selected.
//   e.target.focus();
//   this.setState({ copySuccess: ' Copied!' });
// };

// copyCodeToClipboard = () => {
//   const el = this.textArea
//   el.select()
//   document.execCommand("copy")
//   this.setState({copySuccess: true})
// }

  render() {
    let players = this.props.allPlayers;
    let playerBoard = [];
    for (let i = 0; i < players.length; i++) {
      playerBoard.push(players[i].name);
    }
    // if (playerBoard.length < 1) {
    //   playerBoard = "Loading players...";
    // }
    return (
      <div>
      
      {this.props.playerNumber === false ? (
        <div>
          It looks like the game you're trying to join has already started.
          <div>
            <button class="btn btn-success">
              <Link to='/'>Go Home</Link>
            </button>
          </div>
        </div>
      ) : (
        <div>
        {!this.state.gameStarted ? (
          <div className="first">
            <h1>The Waiting Room</h1>
    
            <form>
              <div className="form-group" controlId="exampleForm.ControlTextarea1">
                <p></p>
                  <h4>Send this invite link to friends</h4>
                  <textarea className="form-control" value={this.props.gameIdUrl} ref={(textarea) => this.textArea = textarea}/>
              </div>
            </form>
            
            <CopyToClipboard text={this.props.gameIdUrl}
              onCopy={() => this.setState({copied: true, copySuccess: "Link copied!"})}>
              <Button variant="warning">Copy Link</Button>
            </CopyToClipboard>
            <p>
            </p>{this.state.copySuccess}
    
            <p></p><h2>Who's Joined:</h2>
            {this.props.allPlayers !== [{name: "Loading Players", _id: "Test ID"}] && this.props.allPlayers !== null ? (
              <div>
                {playerBoard.map((item) => {
                  return(
                    <div>
                      {item}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>No one's joined yet </div>
            )}
            </div>
          ) : (
            <div>
            </div>
          )}
    
          {!this.state.gameStarted && !this.props.isHost ? (
            <div>
              <p></p>
              <em>Waiting for host to start game ...</em>
            </div>
          ) : (
            <div>
            </div>
          )}
    
          {this.state.gameStarted && !this.props.isHost ? (
            <div>
            <p>The host has started the game!</p>
              <Link to='/writing'>
                <Button variant="success">Begin Writing</Button>
              </Link>
            </div>
          ) : (
            <div>
            </div>
          )}

          {!this.state.gameStarted && this.props.isHost && this.props.allPlayers.length <= 1 ? (
            <div>
            <p></p>
              <Link to='/writing'>
                <Button variant="primary" disabled>Start Game for Everyone</Button>
              </Link>
            </div>
          ) : (
            <div>
            </div>
          )}
    
          {!this.state.gameStarted && this.props.isHost && this.props.allPlayers.length > 1 ? (
            <div>
            <p></p>
              <Link to='/writing'>
                <Button variant="primary" onClick={this.props.startGame}>Start Game for Everyone</Button>
              </Link>
            </div>
          ) : (
            <div>
            </div>
          )}
        </div>
      )}

      </div>
    )
  }
}


export default WaitScreen;
