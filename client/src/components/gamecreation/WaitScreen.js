import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./waitscreen.css";
import { Button } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';

class WaitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: "Default",
      gameStarted: false,
      copySuccess: ''
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
//   let copyText = e.target.value;
//
//   /* Select the text field */
//   copyText.select();
//   copyText.setSelectionRange(0, 99999); /*For mobile devices*/
//
//   /* Copy the text inside the text field */
//   document.execCommand("copy");
//
//   /* Alert the copied text */
//   alert("Copied the text: " + copyText.value);
// }

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
        .then(game => this.setState({
          gameInfo: game.data[0].players,
          gameStarted: game.data[0].gameStarted
        }));
        console.log(this.state.gameInfo);
    }
  }

  beginGame = (e) => {
    e.preventDefault();
    console.log("begin game functionality will go here");
    //do a put request to server to begin game
    let gameStatus = {
      gameStatus: true
    }
    axios.put(`api/games/${this.props.gameId}/startGame`, gameStatus)
  }

  copyToClipboard = (e) => {
  this.textArea.select();
  document.execCommand('copy');
  // This is just personal preference.
  // I prefer to not show the whole text area selected.
  e.target.focus();
  this.setState({ copySuccess: ' Copied!' });
};

  render() {
    let players = this.state.gameInfo;
    let playerBoard = [];
    for (let i = 0; i < players.length; i++) {
      playerBoard.push(players[i].name);
    }
    return (
      <div>
      {!this.state.gameStarted ? (
      <div className="first">
        <h1>The Waitroom</h1>
        <form>
          <div className="form-group" controlId="exampleForm.ControlTextarea1">
            <h2>Invite your friends!</h2>
            <textarea className="form-control" value={this.props.gameIdUrl} ref={(textarea) => this.textArea = textarea}/>
          </div>
        </form>
        {
         /* Logical shortcut for only displaying the
            button if the copy command exists */
         document.queryCommandSupported('copy') &&
          <div>
            <Button variant="warning" onClick={this.copyToClipboard}>Copy Link</Button>
            {this.state.copySuccess}
          </div>
        }
        <h2>Who's Joined:</h2>
        {this.state.gameInfo !== "Default" && this.state.gameInfo !== null ? (
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
          Waiting for host to start game ...
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

      {!this.state.gameStarted && this.props.isHost ? (
        <div>
          <Link to='/writing'>
            <Button variant="primary" onClick={this.props.startGame}>Start Game for Everyone</Button>
          </Link>
        </div>
      ) : (
        <div>
        </div>
      )}

      </div>
    )
  }
}


export default WaitScreen;
