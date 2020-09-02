const express = require('express');
const router = express.Router();

const Game = require('../../models/Game');

// @route   GET api/stories
// @desc    Test route
// @check   Passed
router.get('/', (req, res) => res.send('Story route'));

// @route   POST api/stories/write/:code
// @desc    Add a new line of story to the player's story array
// @check   Passed

router.post('/write/:code', (req, res) => {
  Game.findOne({code: req.params.code }, function (err, game) {
    if (err) {
      res.status(404).send("data is not found");
      return;
    }
    let playerNumber = req.body.playerNumber;
    let storyLocation = game.players[playerNumber].story;
    let newLine = req.body.story;
    let round = req.body.round - 1;
    console.log(round);
    storyLocation.push(newLine);
    console.log(`game.storiesSubmitted[round] is ${game.storiesSubmitted[round]}`);
    console.log(`we are replacing${game.storiesSubmitted[round][playerNumber]}`);
    game.storiesSubmitted[round][playerNumber] = true;
    game.markModified('players');
    game.markModified('storiesSubmitted');
    game.save();
    console.log(game.storiesSubmitted);
    res.json('Wow you did it!');
  });
});

// @route   GET api/stories/:code/storiesSubmitted
// @desc    See if all stories have been submitted for the round
// @check   Passed
router.get('/:code/:round/storiesSubmitted', (req, res) => {
  // let playerNumber = req.body.playerNumber;
  let code = req.params.code;
  let round = parseInt(req.params.round) - 1;
  Game.find({code: code}, function(err, game) {
    console.log(game);
    let length = game[0].players.length;
    console.log(`the length of players is ${length}`);
    console.log(`the current round is ${round}`);
    //go through the round array and see if all are true;
    for (let i = 0; i < length; i++) {
      //search through the array for the round to see if all true
      if (game[0].storiesSubmitted[round][i] === false) {
      // if (game.storiesSubmitted[round][i] === false) {
        res.json(false);
        return;
      }
    }
    res.json(true);
  });
});

// @route   PUT api/stories/:code/grabNewStory
// @desc    Grab new story to add off of, but also edit some backend info
// @check   Passed
router.put('/:code/grabNewStory', (req, res) => {
  let code = req.params.code;
  let round = req.body.round - 1;
  // let roundWeAreOn = req.body.round; //this will be used for something else
  let playerNumber = req.body.playerNumber;
  let storyNumber;
  Game.findOne({code: code}, function(err, game) {
    console.log(game);
    let length = game.players.length;
    console.log(length);
    // Go ahead and return if the stories have all been submitted already
    // if (game.storiesReturned === length) {
    //   res.json("You already got your story");
    //   return;
    // }
    if (playerNumber > 0) {
      storyNumber = playerNumber - 1;
      console.log(`storyNumber is ${storyNumber}`);
    }
    else {
      storyNumber = length - 1;
      console.log(`storyNumber is ${storyNumber}`);
    }
    let storyToSend = game.players[storyNumber].story[game.currentRound - 1];
    if (!storyToSend) {
      return;
    }
    // console.log(`the story to send is ${storyToSend}`);
    // console.log(game.storiesReturned);
    //set correct array location to true
    game.storiesReturned[round][playerNumber] = true;
    let isLastRound = false;

    //return if player is behind on rounds
    if (round + 1 < game.currentRound) {
      console.log("behind on rounds. exit now");
      return;
    }

    // See if ALL stories are now sent out
    let storiesSentOut = 0;
    for (let i = 0; i < length; i++) {
      //search through the array for the round to see if all true
      if (game.storiesReturned[round][i] === true) {
        storiesSentOut = storiesSentOut + 1
        if (storiesSentOut === length) {
          game.currentRound = game.currentRound + 1;
          if (game.currentRound === game.rounds) {
            isLastRound = true;
          }
        }
      }
    }
    console.log(`the story we are sending is ${storyToSend} from ${game.players[storyNumber].name}`);
    let storyInfo = {
      story: storyToSend,
      player: game.players[storyNumber].name,
      avatar: game.players[storyNumber].avatar,
      round: game.currentRound,
      isLastRound: isLastRound
    }
    game.markModified('storiesReturned');
    game.save();
    if (err) {
      res.json(err);
    }
    else {
      res.json(storyInfo);
    }
  });
});

// @route   GET api/stories/:code/:playerId/finalStory
// @desc    Player fetches final, completed story from backend
// @check   Passed
router.get('/:code/:playerId/finalStory', (req, res) => {
  let code = req.params.code;
  let playerNumber = parseInt(req.params.playerId);
  Game.findOne({code: code}, function(err, game) {
    let chainedStory = [];
    let storyNeeded;
    let rounds = game.rounds;
    let length = game.players.length;
    for (let i = 1; i <= rounds; i++) {
      storyNeeded = (playerNumber - 1 + i) % length;
      console.log(`storyNeeded is ${storyNeeded}`);
      console.log(`game.players[storyNeeded] is ${game.players[storyNeeded]}`);
      console.log(`game.players[storyNeeded].story[i - 1] is ${game.players[storyNeeded].story[i - 1]}`);
      let storySpot = game.players[storyNeeded].story[i - 1];
      //add space to end of line
      if (storySpot[storySpot.length - 1] !== " " && i !== rounds) {
        storySpot = storySpot + " ";
      }
      //remove hanging space at beginning of line
      if (storySpot[storySpot[0]] === " " && i !== rounds) {
        storySpot[0] = "";
      }
      chainedStory.push(storySpot);
    }
    let draft = "";
    for (let q = 0; q < chainedStory.length; q++) {
      draft = draft + chainedStory[q];
    }
    console.log(`the draft is ${draft}`);
    res.json(draft);
  });
});


module.exports = router;
