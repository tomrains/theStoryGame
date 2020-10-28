import React from 'react';

import { Link } from 'react-router-dom';

import { Button } from 'react-bootstrap';

import "./storyrevealed.css";

// import FullStory from './subcomponents/FullStory.js';
// import GameMasterPlayAgain from './subcomponents/GameMasterPlayAgain.js';
// import HideMyStory from './subcomponents/HideMyStory.js';
// import SaveMyStory from './subcomponents/SaveMyStory.js';

// import Button from 'react-bootstrap/Button';

import { CopyToClipboard } from 'react-copy-to-clipboard';

class Storyrevealed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      //state here
      copySuccess: '',
      copied: false
    }
  }

  render() {
    //variables, logic and so on here
      return (
        <div>
          <h1>{this.props.playerName}'s Story</h1>
          <p>{this.props.finalStory}</p>
          <CopyToClipboard text={this.props.finalStory}
            onCopy={() => this.setState({copied: true, copySuccess: "Story copied!"})}>
            <Button variant="warning">Copy Story</Button>
          </CopyToClipboard>
        <p></p> {this.state.copySuccess} <p></p>
          <button class="btn btn-success">
            <Link to='/'>Play Again</Link>
          </button>
        </div>
      )
    }
  }

export default Storyrevealed;
