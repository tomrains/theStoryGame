import React from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import { ProgressBar, Button } from 'react-bootstrap';
// import Progress from 'semantic-ui-react';
import HelpModal from './HelpModal.js';
import RemovePlayerModal from './RemovePlayerModal.js';

class Writingpaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charactersAllowed: 150,
      charactersUsed: 0,
      charactersLeft: 150,
      currentRound: 1,
      minimimumCharactersRequired: 135,
      story: "",
      roundForAppUpdate: 1,
      submitStory: false,
      storySubmitted: false,
      endGame: false,
      isLastRound: false,
      makeLastRound: false,
      needHelp: false,
      everyoneHasSubmitted: false,
      previousPersonsWriting: "Example",
      previousPerson: "[Name of Previous Person Here]",
      avatarOfPreviousPerson: "[Avatar of Previous Person Here]",
      nudgeText: "Begin your story here",
      playersStillWorking: "Just waiting on everyone to finish.",
      snarkyWaitingLine: " Penning a masterpiece, I'm sure.",
      newPlayerNumber: null
      // showRemovePlayerModal: false
    }
  }

  intervalID;

  componentDidMount() {
    this.getPlayers();
    this.hasEveryoneSubmitted();
    // pausing for now so it stops fetching lol
    this.intervalID = setInterval(this.hasEveryoneSubmitted.bind(this), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  getPlayers = () => {
    console.log(this.props.gameId);
    axios.get(`api/players/${this.props.gameId}/player`)
      .then(game => this.props.updateAllPlayers(game.data[0].players)); 
  }

  hasEveryoneSubmitted = () => {
    // this.props.updateRoundNumber(this.state.roundForAppUpdate);
    //make a get request to fetch the current round and update it
    // only enter this loop if you have submitted your story and you do NOT have your final story
    if (this.state.storySubmitted && !this.props.hasFinalStory) {
    // list what this should do
    let info1 = {
      round: this.state.currentRound,
    }
    console.log(`this.state.currentRound is ${this.state.currentRound}`);
    axios.get(`api/stories/${this.props.gameId}/${this.state.currentRound}/${this.props.gameId}/storiesSubmitted`, info1)
      .then(res => this.setState({
        everyoneHasSubmitted: res.data.everyoneHasSubmitted,
        playersStillWorking: res.data.playersStillWorking
       }));

      //if it's the last round and everyone's submitted, get your final story
    if (this.state.isLastRound && this.state.everyoneHasSubmitted) {
      let info2 = {
        code: this.props.gameId,
        playerNumber: this.props.playerNumber,
        round: this.state.currentRound
      }
      axios.put(`api/stories/${this.props.gameId}/${this.props.playerNumber}/finalStory`, info2)
        .then(res => this.props.updateFinalStory(res.data))
        .then(this.props.updateHasFinalStory())
        .then(this.setState({ storySubmitted: true })); //might not need this part due to logic in render. test?
    }
    axios.get(`api/stories/${this.props.gameId}/${this.state.currentRound}/storiesSubmitted`, info1)
      .then(res => this.setState({
        everyoneHasSubmitted: res.data.everyoneHasSubmitted,
        playersStillWorking: res.data.playersStillWorking,
        newPlayerNumber: res.data.newNumber
       }));
       if (this.state.newPlayerNumber !== null) {
         this.props.updatePlayerNumber(this.state.newPlayerNumber);
       }
    //if everyone has submitted and you don't have any writing and it's not the last round, go for story
    if (this.state.everyoneHasSubmitted && this.state.previousPersonsWriting === "Example" && !this.state.isLastRound) {
      console.log("do the request for the story that is rightfully yours");
      let info3 = {
        code: this.props.gameId,
        playerNumber: this.props.playerNumber,
        round: this.state.currentRound,
        newPlayerNumber: this.state.newPlayerNumber
      }
      axios.put(`api/stories/${this.props.gameId}/grabNewStory`, info3)
        .then(res => this.setState({
          previousPersonsWriting: res.data.story, //only change stuff below IF this is equal to something?
          previousPerson: res.data.player,
          storySubmitted: false,
          everyoneHasSubmitted: false,
          currentRound: res.data.round + 1,
          isLastRound: res.data.isLastRound
        })
      );
      this.props.updateAppLevelRound();
        if (this.props.rounds - this.state.currentRound === 0) {
          this.setState({ nudgeText: "Finish the story here" })
        }
      }
    }
  // if you haven't submitted your story, or you have your final story, exit the loop
  else {
    return;
  }
}

  updateStory = (e) => {
    //put the story into state so submit button can send it on
    this.setState({ story: e.target.value });
    this.setState({ charactersLeft: (this.state.charactersAllowed - e.target.value.length) });
    this.setState({ charactersUsed: e.target.value.length })
  };

  //This function sends the writing to the backend
  //First, we'll try to send it to that player. Eventually, it will go to the player who originally wrote it
  putWriting = (e) => {
    // e.preventDefault();
    this.setState({ playersStillWorking: "Just waiting on everyone to finish." });
    console.log("and here we are");
    let playerStory = {
      code: this.props.gameId,
      playerNumber: this.props.playerNumber,
      story: this.state.story,
      round: this.state.currentRound
    }
    axios.post(`api/stories/write/${this.props.gameId}`, playerStory)
      .then(this.setState({
        charactersUsed: 0,
        charactersLeft: 150,
        story: "Write your story here",
        storySubmitted: true,
        previousPersonsWriting: "Example",
        submitStory: false,
        nudgeText: "Continue the story here"
       }));
  }

  deleteDefaultText = (e) => {
    if (e.target.value === "Begin your story here" || e.target.value === "Continue the story here" || e.target.value === "Finish the story here") {
      e.target.value = "";
    }
    this.setState({ everyoneHasSubmitted: false });
  }

  tryToSubmit = (e) => {
    console.log("try to submit");
    this.setState({ submitStory: true });
  }

  neverMind = (e) => {
    this.setState({ submitStory: false });
  }

  quitGame = () => {
    console.log("They're ready to quit!");
  }

  // RemovePlayerModal = (props) => {
  //   return (
  //     <Modal />
  //     <div>{{allPlayers: props.allPlayers}}</div>
  //   )
  // }

  // const Child = (props) => {
  //   return (
  //     <div style={{backgroundColor: props.eyeColor}} />
  //   )
  // }

  // toggleRemovePlayerModal = () => {
  //   this.setState({ showRemovePlayerModal: true });
  // }

  // waitText = () => {
  //   return "Oh wow!";
  //   // return '<div>'+'<p>Waiting for everyone to finish the round.</p>'+'<p>In the meantime, enjoy this dancing unicorn</p>'+'</div>';
  // }

  render() {
    // let allPlayers = this.props.allPlayers;
    // let playerBoard = [];
    // for (let q = 0; q < allPlayers.length; q++) {
    //   playerBoard.push(allPlayers[q].name);
    // }
    let waitText = "";
    let snarkyWaitingLine = "";
    if (!this.props.finalStory) {
      waitText = `${this.state.playersStillWorking}`;
      snarkyWaitingLine = `${this.state.snarkyWaitingLine}`;
    }
    else {
      waitText = null;
      snarkyWaitingLine = null;
    }

    //variables, logic and so on here
    let lastLine;
    let previousPersonsWriting = this.state.previousPersonsWriting;
    let length = previousPersonsWriting.length;
    let spaceCounter = 0;
    for (let i = length - 50; i > 0 ; i--) {
      if (previousPersonsWriting[i] === " ") {
        spaceCounter = spaceCounter + 1;
        lastLine = "..." + previousPersonsWriting.slice(i + 1, length);
        i = 0;
      }
    }
    if (spaceCounter === 0) {
      lastLine = previousPersonsWriting.slice(length - 50, length);
    }
      return (
        //the organization here is wrong, but the components are there
        <div>
          {!this.state.storySubmitted && !this.props.hasFinalStory ? (
          <div>
          <h1>Your Story</h1>
            <p>Round {this.state.currentRound} of {this.props.rounds}</p>
            {this.state.previousPersonsWriting === "Example" ? (
              <div>
              </div>
            ) : (
              <div>
                This is what {this.state.previousPerson} wrote for you:
                <div>{lastLine}</div>
              </div>
            )}
            <form>

              {this.state.isLastRound === false ? (
                <div>
                  <div className="form-group">
                    <label></label>
                    <textarea className="form-control text-monospace" maxLength="150"
                    onChange={this.updateStory}
                    onClick={this.deleteDefaultText}
                    defaultValue={this.state.nudgeText} />
                  </div>
                  <p>Characters remaining: {this.state.charactersLeft} </p>
                  <p><ProgressBar now={this.state.charactersUsed} min="0" max="135" /></p>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label></label>
                    <textarea className="form-control text-monospace"
                    onChange={this.updateStory}
                    onClick={this.deleteDefaultText}
                    defaultValue={this.state.nudgeText} />
                  </div>
                  <p>
                    Finish the story. No character limit. Submit when ready.
                  </p>
                </div>
              )
            }

              </form>

              {this.state.submitStory && !this.state.storySubmitted ? (
                <p>
                  Confirm submission?
                  <p>
                  </p>
                  <p>
                    <Button variant="success" onClick={this.putWriting}>Yes</Button>
                    {' '}
                    <Button variant="danger" onClick={this.neverMind}>No</Button>
                  </p>
                </p>
                ) : (
                <div>
                </div>
                )
              }

              {!this.state.storySubmitted &&
                !this.state.submitStory &&
                this.state.charactersLeft > 15 && !this.state.isLastRound ? (
                <Button variant="primary" disabled>Submit writing</Button>
                ) : (
                <div>
                </div>
                )
              }

              {(!this.state.storySubmitted &&
                !this.state.submitStory &&
                this.state.charactersLeft <= 15) || (this.state.isLastRound && !this.state.storySubmitted &&
                  !this.state.submitStory) ? (
                    <Button variant="primary" onClick={this.tryToSubmit}>Submit writing</Button>
                ) : (
                <div>
                </div>
                )
              }

              {this.props.isHost && this.state.endGame ? (
                <p>
                  <Button variant="danger">Are you sure you want to end the game for everyone?</Button>
                  <button>Yes</button>
                  <button>No</button>
                </p>
                ) : (
                <div>
                </div>
                )
              }

            </div>
          ) : (
            <div>
              {waitText}
            </div>
          )
        }

        {this.props.hasFinalStory ? (
          <div>
            <p>Everyone's turned in their story.</p>
            <p>Reveal yours below.</p>
              <Link to='/story'>
                <Button variant="success">Reveal My Story</Button>
              </Link>
          </div>
          ) : (
            <div>
            </div>
          )
        }

        {this.props.isHost && !this.props.hasFinalStory ? ( 
          <div>
            <p>

            </p>
            <RemovePlayerModal 
              allPlayers={this.props.allPlayers} 
              removePlayer={this.props.removePlayer} 
              playerToDelete={this.props.playerToDelete}
              updatePlayerToDelete={this.props.updatePlayerToDelete}
              currentRound={this.state.currentRound}
              />
          </div>
        ) : (
          <div>
          </div>
        )
        }

      {!this.state.storySubmitted && !this.props.hasFinalStory? (
        <div>
        <p></p>
        <HelpModal />
        </div>
      ) : (
        <div>
        </div>
      )}
        </div>
      )
    }
  }


export default Writingpaper;



/*{this.props.isHost ? (
  <div>
    <p>
      <button>Make this the last round (make this toggle)</button>
    </p>
  </div>
  ) : (
  <div>
  </div>
  )
}

{this.props.isHost && !this.state.endGame ? (
  <button>End Game</button>
  ) : (
  <div>
  </div>
  )
}

{this.state.needHelp ? (
  <div>
    <p>
      Helpy stuff here
    </p>
  </div>
  ) : (
  <div>
    <button>Help</button>
  </div>
  )
}*/
