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

router.post('/write/:code/:round/:playerNumber/:story', (req, res) => {
  Game.findOne({code: req.params.code }, function (err, game) {
    if (err) {
      res.status(404).send("data is not found");
      return;
    }
    let playerNumber = parseInt(req.params.playerNumber);
    let newLine = req.params.story;
    //consider changing this to use game.currentRound - 1
    let round = (parseInt(req.params.round) - 1);
    // console.log(`round is ${round}`);
    // console.log(`game.storiesSubmitted[round] is ${game.storiesSubmitted[round]}`);
    // console.log(`we are replacing${game.storiesSubmitted[round][playerNumber]}`);
    game.storyTexts[round][playerNumber] = newLine;
    game.storiesSubmitted[round][playerNumber] = true;
    game.markModified('storyTexts');
    game.markModified('storiesSubmitted');
    game.save(function (err) {
      if (err) {
        console.log("WE'VE FOUND AN ERROR");
        let failure = {
          success: false
        }
        // handleError(error);
        res.json(failure);
        return;
      }
    });
    // console.log(game.storiesSubmitted);
    // console.log(game.storyTexts[round][playerNumber]);
    res.json('Wow you did it!');
  });
});

// @route   GET api/stories/storiesSubmitted/:code/:round
// @desc    See if all stories have been submitted for the round, and see if you need a new playerNumber
// @check   Passed
router.get('/storiesSubmitted/:code/:round', (req, res) => {
  // let playerNumber = req.body.playerNumber;
  let code = req.params.code;
  let gameId = req.params.gameId;
  let round = parseInt(req.params.round) - 1;
  Game.find({code: code}, function(err, game) {
    let newNumber = null;
    if (game[0].playerDeleted) {
      // look for your name and avatar?
      //do stuff to change your number
      for (let q = 0; q < game[0].players.length; q++) {
        if (game[0].players[q]._id === gameId) {
          newNumber = game[0].players[q].number;
          console.log(`the newNumber for the player is ${newNumber}`);
        }
      }
    }
    // console.log(game);
    let length = game[0].originalPlayers.length;
    // let currentLength = game[0].players.length;
    // let round = game[0].currentRound - 1; //Change?
    // console.log(`the length of players is ${length}`);
    // console.log(`the current round is ${round}`);
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
        playersStillWorking.push(game[0].originalPlayers[i].name);
      }
    }

    let allSubmittedDoubleCheck = true;
    let showSnarkyWaitingLine = false;
    //adding in double check to see if that helps
    for (let y = 0; y < length; y++) {
      //search through the array for the round to see if all true
      if (game[0].storiesSubmitted[round][y] === false) {
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
        playersStillWorking = "Just waiting on " + playersStillWorking + " to finish.";
        showSnarkyWaitingLine = true;
      }
    }
    if (allSubmitted && allSubmittedDoubleCheck) {
      allSubmitted === true;
    }
    else { //more stuff for the double check (might need to fix)
      allSubmitted === false;
      playerStillWorking = "Just waiting on everyone to finish";
    }
    // console.log(`The playersStillWorking variable is ${playersStillWorking}`);
    let storyInfo = {
      everyoneHasSubmitted: allSubmitted,
      playersStillWorking: playersStillWorking,
      newNumber: newNumber,
      showSnarkyWaitingLine: showSnarkyWaitingLine
    }
    res.json(storyInfo);
  });
});

// @route   GET api/stories/grabNewStory/:code/:playerNumber/:round
// @desc    Grab new story to add off of
// @check   Passed
router.get('/grabNewStory/:code/:playerNumber/:round', (req, res) => {
  let code = req.params.code;
  let roundRightNow = parseInt(req.params.round);
  // let round = req.body.round - 1;
  // let roundWeAreOn = req.body.round; //this will be used for something else
  let playerNumber = parseInt(req.params.playerNumber);
  console.log(`playerNumber from the req.body is ${playerNumber}`);
  console.log(`the newPlayerNumber from the body is ${req.body.newPlayerNumber}`);
  if (req.body.newPlayerNumber !== undefined) { //change this variable to carry as a param if it causes trouble
    playerNumber = req.body.newPlayerNumber;
    console.log(`playerNumber is now ${playerNumber}`);
  }
  let storyNumber;
  Game.findOne({code: code}, function(err, game) {
    if (err) {
      res.status(404).send("data is not found");
      return;
    }
    // console.log(game);
    let length = game.players.length;
    let originalLength = game.originalPlayers.length;
    console.log(length);
    let round = roundRightNow - 1;
    // let roundRightNow = game.currentRound;
    console.log(`The current round (minus 1) is ${round}`);
    // Go ahead and return if the stories have all been submitted already
    // if (game.storiesReturned === length) {
    //   res.json("You already got your story");
    //   return;
    // }

    if (playerNumber > 0) { //if the player isnt the host
      // console.log(`PLAYERNUMBER ${playerNumber} IS MORE THAN 0`);
      storyNumber = playerNumber - 1;
      while (game.deletedPlayersNumbers.indexOf(storyNumber) !== -1) { //if the story you need is from a deleted player
        // console.log(`the requested story belongs to a deleted player`);
        if (storyNumber > 0) {
          storyNumber = storyNumber - 1;
          // console.log(`storyNumber has been changed to ${storyNumber}`);
        }
        else {
          storyNumber = originalLength - 1;
          // console.log(`storyNumber has been changed to ${storyNumber}`);
        }
      }
      // console.log(`storyNumber is ${storyNumber}`);
    }
    else { //if the player is the host
      // console.log(`THIS IS THE HOST`);
      storyNumber = originalLength - 1; 
      while (game.deletedPlayersNumbers.indexOf(storyNumber) !== -1) {
        // console.log(`the requested story belongs to a deleted player`);
        if (storyNumber > 0) {
          storyNumber = storyNumber - 1;
          // console.log(`storyNumber has been changed to ${storyNumber}`);
        }
        else {
          storyNumber = originalLength - 1;
          // console.log(`storyNumber has been changed to ${storyNumber}`);
        }
      }
      // console.log(`storyNumber is ${storyNumber}`);
    }
    let storyToSend = game.storyTexts[round][storyNumber];
    //Change storyToSend if it's a Player Bailed one.
    // if (storyToSend === "PLAYER BAILED") {
    //   if (playerNumber > 1) {
    //     storyNumber = playerNumber - 2;
    //     console.log(`storyNumber is ${storyNumber}`);
    // }
    // console.log(`OUT OF THE LOOP: storyNumber is ${storyNumber} and it's coming from ${game.originalPlayers[storyNumber].name}`);
    if (!storyToSend) {
      // console.log(`there is no storyToSend`);
      return;
    }
    // game.storiesReturned[round][playerNumber] = true;
    // game.markModified('storiesReturned'); //trying this here to see if it prevents later error
    // game.save();
    // game.save(function(err, game) {
    //   if (err) return console.error(err);
    //   console.log("Document successfully updated!");
    // });
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

    //SOMETHING HERE is not working (actually the game.save seems to be broken)
    // See if ALL stories are now sent out
    // let storiesSentOut = 0;
    // console.log(`stories sent out before we start counting is ${storiesSentOut}`);
    // for (let i = 0; i < originalLength; i++) {
    //   //search through the array for the round to see if all true
    //   if (game.storiesReturned[round][i] === true) {
    //     storiesSentOut = storiesSentOut + 1;
    //     console.log(`adding 1 to storiesSentout. it is now ${storiesSentOut}`);
    //     if (storiesSentOut === originalLength) {
    //       console.log(` the stories have all been sent out. adding one to currentRound now`);
    //       game.currentRound = game.currentRound + 1;
    //       game.markModified('currentRound');
    //       console.log(`the round has been changed to ${game.currentRound}`);
    //       // if (game.currentRound === game.rounds) {
    //       //   isLastRound = true;
    //       // }
    //     }
    //     else {
    //       console.log(`not all the stories have been sent out`);
    //     }
    //   }
    // }
    console.log(`the story we are sending is ${storyToSend} from ${game.originalPlayers[storyNumber].name}`);
    let storyInfo = {
      story: storyToSend,
      player: game.originalPlayers[storyNumber].name,
      avatar: game.originalPlayers[storyNumber].avatar,
      round: roundRightNow,
      isLastRound: isLastRound
    }
    // game.markModified('storiesReturned');
    // game.markModified('currentRound');
    // game.save();
    if (err) {
      res.json(err);
    }
    else {
      // game.save();
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
  console.log(`playerNumber is initially ${playerNumber}`);
  Game.findOne({code: code}, function(err, game) {
    let chainedStory = [];
    let storyNeeded;
    let rounds = game.rounds;
    let length = game.originalPlayers.length; //this used to be game.players.length
    let counter = 0;
    //Look to see if you shouldn't be receiving your story because deleted player messed things up
    if (game.storyBeginningsNotReturned.indexOf(playerNumber) !== -1) { //if you have to change your number
      //figure out what index is
      console.log(`this player's story beginning will not be returned`);
      let index = game.storyBeginningsNotReturned.indexOf(playerNumber);
      console.log(`the index in the storyBeginningsNotReturned array is ${index}`);
      playerNumber = game.deletedPlayersNumbers[index];
      while (game.storyBeginningsNotReturned.indexOf(playerNumber) !== -1 ) { //if this number is also in storyBeginningsNotReturned
        counter = counter + 1;
        if (counter > 2 * length) {
          return;
        }
        neededIndex = game.deletedPlayersNumbers.indexOf(playerNumber);//index of THIS number in the players deleted array
        playerNumber = game.deletedPlayersNumbers[neededIndex];
        // while (playerNumber >= game.originalPlayers.length) {
        //   playerNumber = 0;
        // }
      }
      console.log(`the new playerNumber is now ${playerNumber}`);
    }

    // i really should be 0, not 1.
    // for (let i = 1; i <= rounds; i++) {
      for (let i = 0; i < rounds; i++) {
      if (i === 0) {
        storyNeeded = playerNumber;
      }
      else {
        storyNeeded = storyNeeded + 1;
      }
      if (storyNeeded >= length) {
        storyNeeded = 0;
      }
      // console.log(`storyNeeded is ${storyNeeded}`);
      // console.log(`game.storyTexts[i - 1][storyNeeded] is ${game.storyTexts[i - 1][storyNeeded]}`);
      // console.log(`game.players[storyNeeded].story[i - 1] is ${game.players[storyNeeded].story[i - 1]}`);
      let storySpot = game.storyTexts[i][storyNeeded];
      //if storySpot is from a plyer who bailed, change it!
      while (storySpot === "PLAYER BAILED") {
        storyNeeded = storyNeeded + 1;
        if (storyNeeded >= length) {
          storyNeeded = 0;
        }
        storySpot = game.storyTexts[i][storyNeeded];
        // storySpot = game.storyTexts[i - 1][(playerNumber - 2 + i) % length]; //this line might be messed up - it should change the story you collect if its from a bailed player
      }
      //add space to end of line
      if (storySpot[storySpot.length - 1] !== " " && i !== (rounds - 1)) {
        storySpot = storySpot + " ";
      }
      //remove hanging space at beginning of line
      if (storySpot[storySpot[0]] === " " && i !== (rounds - 1)) {
        storySpot[0] = "";
      }
      chainedStory.push(storySpot);
    }
    let draft = "";
    for (let q = 0; q < chainedStory.length; q++) {
      draft = draft + chainedStory[q];
    }
    console.log(`the draft is ${draft}`);
    // game.storiesReturned[rounds - 1][playerNumber] =  true;
    // game.markModified('storiesReturned'); //this often doesnt work, right?
    res.json(draft);
  });
});


module.exports = router;
