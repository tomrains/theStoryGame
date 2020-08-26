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
    let playerNumber = req.body.playerNumber;
    let storyLocation = game.players[playerNumber].story;
    let newLine = req.body.story;
    game.save(storyLocation.push(newLine));
      if (err){
        res.status(404).send("data is not found");
      }
      else {
        game.storiesSubmitted = game.storiesSubmitted + 1;
        console.log(game.storiesSubmitted);
        res.json('Wow you did it!');
      }
  });
});

// @route   GET api/stories/:code/storiesSubmitted
// @desc    See if all stories have been submitted for the round
// @check   Passed
router.get('/:code/storiesSubmitted', (req, res) => {
  let code = req.params.code;
  let playerNumber = req.body.playerNumber;
  let storyToSend;
  Game.find({code: code}, function(err, game) {
    console.log(game);
    let length = game[0].players.length;
    console.log(`the length of players is ${length}`);
    // If any player has submitted a story
    if (game[0].storiesSubmitted !== 0) {
      console.log("1 or more stories have been submitted");
      // If every player has submitted a story
      if (game[0].storiesSubmitted % length === 0) {
        console.log("everyone has submitted their story");
        res.json(true);
        return;
      }
    }
      res.json(false);
    });
  });

// @route   PUT api/stories/:code/grabNewStory
// @desc    Grab new story to add off of, but also edit some backend info
// @check   Passed
router.put('/:code/grabNewStory', (req, res) => {
  let code = req.params.code;
  let playerNumber = req.body.playerNumber;
  let storyNumber;
  Game.findOne({code: code}, function(err, game) {
    console.log(game);
    let length = game.players.length;
    console.log(length);
    // Go ahead and return if the stories have all been submitted already
    if (game.storiesReturned === length) {
      res.json("You already got your story");
      return;
    }
    if (playerNumber > 0) {
      storyNumber = playerNumber - 1;
      console.log(`storyNumber is ${storyNumber}`);
    }
    else {
      storyNumber = length - 1;
      console.log(`storyNumber is ${storyNumber}`);
    }
    if (game.players[storyNumber].story[game.currentRound - 1]) {
      storyToSend = game.players[storyNumber].story[game.currentRound - 1];
    }
    else {
      res.json("You already have a story. Jumping ahead");
      return;
    }
    console.log(`the story to send is ${storyToSend}`);
    console.log(game.storiesReturned);
    game.storiesReturned = game.storiesReturned + 1;
    console.log(`storiesReturned has been increased by 1 and is now ${game.storiesReturned}`);
    let isLastRound = false;
    if (game.storiesReturned === length) {
      console.log("all users have been sent new stories");
      game.currentRound = game.currentRound + 1;
      game.storiesReturned = 0;
      game.storiesSubmitted = 0;
      if (game.currentRound === game.rounds) {
        isLastRound = true;
      }
    }
    let storyInfo = {
      story: storyToSend,
      player: game.players[storyNumber].name,
      avatar: game.players[storyNumber].avatar,
      round: game.currentRound,
      isLastRound: isLastRound
    }
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
  let playerNumber = req.params.playerId;
  Game.findOne({code: code}, function(err, game) {
    let chainedStory = [];
    let storyNeeded;
    let rounds = game.rounds;
    let length = game.players.length;
    for (let i = 1; i <= rounds; i++) {
      storyNeeded = (playerNumber - 1 + i) % length;
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
