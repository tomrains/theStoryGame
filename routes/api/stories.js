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
    let newLine = req.body.story;
    //consider changing this to use game.currentRound - 1
    let round = req.body.round - 1;
    console.log(round);
    console.log(`game.storiesSubmitted[round] is ${game.storiesSubmitted[round]}`);
    console.log(`we are replacing${game.storiesSubmitted[round][playerNumber]}`);
    game.storyTexts[round][playerNumber] = newLine;
    game.storiesSubmitted[round][playerNumber] = true;
    game.markModified('storyTexts');
    game.markModified('storiesSubmitted');
    game.save();
    console.log(game.storiesSubmitted);
    console.log(game.storyTexts[round][playerNumber]);
    res.json('Wow you did it!');
  });
});

// @route   GET api/stories/:code/storiesSubmitted
// @desc    See if all stories have been submitted for the round
// @check   Passed
router.get('/:code/:round/storiesSubmitted', (req, res) => {
  // let playerNumber = req.body.playerNumber;
  let code = req.params.code;
  // let round = parseInt(req.params.round) - 1;
  Game.find({code: code}, function(err, game) {
    console.log(game);
    let length = game[0].players.length;
    let round = game[0].currentRound - 1;
    console.log(`the length of players is ${length}`);
    console.log(`the current round is ${round}`);
    //go through the round array and see if all are true;

    //create array of the names of people who haven't finished.
    //the locations of the players in storiesSubmitt for that round, and go through game.players.something for that to work?

    //Set variable, but change if anyone not done
    let allSubmitted = true;
    let playersStillWorking = [];
    for (let i = 0; i < length; i++) {
      //search through the array for the round to see if all true
      if (game[0].storyTexts[round][i] === false) { //changed this to search storyTexts array instead of storiesSubmitted array
      // if (game.storiesSubmitted[round][i] === false) {
        allSubmitted = false;
        playersStillWorking.push(game[0].players[i].name);
      }
    }

    let allSubmittedDoubleCheck = true;
    //adding in double check to see if that helps
    for (let y = 0; y < length; y++) {
      //search through the array for the round to see if all true
      if (game[0].storiesSubmitted[round][y] === false) { //changed this to search storyTexts array instead of storiesSubmitted array
      // if (game.storiesSubmitted[round][i] === false) {
        allSubmittedDoubleCheck = false;
      }
    }

    if (allSubmitted === true) {
      playersStillWorking = "Your new story is coming.";
    }
    else {
      if (playersStillWorking.length === 2) {
        playersStillWorking = "Just waiting on " + playersStillWorking[0] + " and " + playersStillWorking[1] + " to finish.";
      }
      else if (playersStillWorking.length > 2) {
        let newArrayOfWorkers = "Just waiting on ";
        for (let p = 0; p < playersStillWorking.length; p++) {
          if ( p + 1 < playersStillWorking.length) {
            newArrayOfWorkers = newArrayOfWorkers + playersStillWorking[p] + ", ";
          }
          else {
            newArrayOfWorkers = newArrayOfWorkers + "and " + playersStillWorking[p] + " to finish."
          }
        }
        playersStillWorking = newArrayOfWorkers;
      }
      else {
        playersStillWorking = "Just waiting on " + playersStillWorking + " to finish."
      }
    }
    if (allSubmitted && allSubmittedDoubleCheck) {
      allSubmitted === true;
    }
    console.log(`The playersStillWorking variable is ${playersStillWorking}`);
    let storyInfo = {
      everyoneHasSubmitted: allSubmitted,
      playersStillWorking: playersStillWorking
    }
    res.json(storyInfo);
  });
});

// @route   PUT api/stories/:code/grabNewStory
// @desc    Grab new story to add off of, but also edit some backend info
// @check   Passed
router.put('/:code/grabNewStory', (req, res) => {
  let code = req.params.code;
  // let round = req.body.round - 1;
  // let roundWeAreOn = req.body.round; //this will be used for something else
  let playerNumber = req.body.playerNumber;
  let storyNumber;
  Game.findOne({code: code}, function(err, game) {
    console.log(game);
    let length = game.players.length;
    console.log(length);
    let round = game.currentRound - 1;
    let roundRightNow = game.currentRound;
    console.log(`The current round (minus 1) is ${round}`);
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
    let storyToSend = game.storyTexts[round][storyNumber];
    if (!storyToSend) {
      return;
    }
    // console.log(`the story to send is ${storyToSend}`);
    // console.log(game.storiesReturned);
    //set correct array location to true

    //trying to move the below
    // game.storiesReturned[round][playerNumber] = true;
    let isLastRound = false;
    if (roundRightNow === game.rounds - 1) {
      isLastRound = true;
    }
    //return if player is behind on rounds
    // if (round + 1 < game.currentRound) {
    //   console.log("behind on rounds. exit now");
    //   return;
    // }

    game.storiesReturned[round][playerNumber] = true;
    // See if ALL stories are now sent out
    let storiesSentOut = 0;
    for (let i = 0; i < length; i++) {
      //search through the array for the round to see if all true
      if (game.storiesReturned[round][i] === true) {
        storiesSentOut = storiesSentOut + 1
        if (storiesSentOut === length) {
          game.currentRound = game.currentRound + 1;
          // if (game.currentRound === game.rounds) {
          //   isLastRound = true;
          // }
        }
      }
    }
    console.log(`the story we are sending is ${storyToSend} from ${game.players[storyNumber].name}`);
    let storyInfo = {
      story: storyToSend,
      player: game.players[storyNumber].name,
      avatar: game.players[storyNumber].avatar,
      round: roundRightNow,
      isLastRound: isLastRound
    }
    game.markModified('storiesReturned');
    game.markModified('currentRound');
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
router.put('/:code/:playerId/finalStory', (req, res) => {
  let code = req.params.code;
  let playerNumber = parseInt(req.params.playerId);
  console.log(playerNumber + 1);
  Game.findOne({code: code}, function(err, game) {
    let chainedStory = [];
    let storyNeeded;
    let rounds = game.rounds;
    let length = game.players.length;
    for (let i = 1; i <= rounds; i++) {
      storyNeeded = (playerNumber - 1 + i) % length;
      // console.log(`storyNeeded is ${storyNeeded}`);
      // console.log(`game.storyTexts[i - 1][storyNeeded] is ${game.storyTexts[i - 1][storyNeeded]}`);
      // console.log(`game.players[storyNeeded].story[i - 1] is ${game.players[storyNeeded].story[i - 1]}`);
      let storySpot = game.storyTexts[i - 1][storyNeeded];
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
    game.storiesReturned[rounds - 1][playerNumber] =  true;
    game.markModified('storiesReturned');
    res.json(draft);
  });
});


module.exports = router;
