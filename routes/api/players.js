const express = require('express');
const router = express.Router();

const Game = require('../../models/Game');

// @route   GET api/players
// @desc    Test route
// @check   Passed
router.get('/', (req, res) => res.send('Player route'));

// @route   PUT api/players/add/:code
// @desc    Add host info and game info after the game has been initialized
// @check   Passed
router.put('/add/:code', (req, res) => {
  Game.findOne({code: req.body.code}, function (err, game) {
    if (!game) {
      res.status(404).send("No game with that code exists!");
      return;
    }
    console.log(game);
    game.rounds = req.body.rounds;
    let hostPlayer = req.body.players;
    game.originalPlayers.push(hostPlayer);
    game.save(game.players.push(hostPlayer));
    let info = {
      playerId: game.players[0]._id
    }
    res.json(info);
  });
});

// @route   PUT api/players/:code
// @desc    Add a non-host player to the game
// @check   Passed
router.put('/:code', (req, res) => {
  console.log(req.params.code);
  console.log(req.body);
  Game.findOne({code: req.params.code }, function (err, game) {
    // Determine what the player's number will be
    let playerNumber;
    playerNumber = game.players.length;
    game.players.push(req.body);
    game.originalPlayers.push(req.body);
    game.removablePlayers.push(req.body);
    game.players[playerNumber].number = playerNumber;
    if (game.gameStarted === true) {
      //tell it they cant join
      let info = {
        playerNumber: false
      }
      res.json(info);
      return;
    }
    game.save();
    let info = {
      playerNumber: game.players[playerNumber].number,
      playerId: game.players[playerNumber]._id
    }
    res.json(info);
  });
});

// @route   GET api/players/:code/player
// @desc    Fetch players that have signed up in a particular game (for waitscreen)
// @check   Passed
router.get('/:code/player', (req, res) => {
  let code = req.params.code;
  Game.find({code: code}, function(err, game) {
    // console.log(game);
    res.json(game);
  });
});

// @route   PUT api/players/delete/:code/:round/:playerId
// @desc    Delete a specific player from a match in progress
// @check   TBD
router.put('/delete/:code/:round/:playerId', (req, res) => {
  let code = req.params.code;
  let playerId = req.params.playerId;
  console.log(typeof playerId);
  console.log(playerId);
  let round = req.params.round - 1;
  Game.find({code: code}, function(err, game) {
    let toDelete;
    console.log(`the round is ${round}`);
    console.log(code);
    console.log("fixing to delete a player");
    // console.log(game[0]);
    playerId = playerId;
    for (let i = 0; i < game[0].players.length; i++) { //change this to id eventually
      console.log(`the found id is ${game[0].players[i]._id}`);
      console.log(`compare this to ${playerId}`);
      if (game[0].players[i]._id.toString() === playerId) {
        console.log("these are the same id");
        toDelete = i;
      }
    }
    if (!toDelete) {
      // let errorMessage = {
      //   error: "A player with matching ID wasn't found. Either they have already been deleted, or no player was select."
      // }
      res.json(game);
      return;
    }
    let playerNumber = game[0].players[toDelete].number;
    console.log(`playerNumber is ${playerNumber}`);
    console.log(`going to delete player ${toDelete}`);
    //add functionality if 2 found
    //add functionality if none found
    game[0].players.splice(toDelete, 1);
    //add functionality to change numbers of the players AFTER this player
    // for (let q = 0; q + toDelete < game[0].players.length; q++) {
    //   game[0].players[q + toDelete].number = toDelete + q;
    // }

    //figure out the story held by player when deleted
    //playernumber minus rounds that have been done

    let storyInDeletedPlayersHands = toDelete - round; //this is only accurate if no players have been deleted
    //maybe if you see a deletedPlayer in between, you add 1?
    let storyIHad = playerNumber;
    console.log(`round plus 1 (w < than round + 1) is now ${round + 1}`);
    console.log(`storyIHad is starting as ${storyIHad} (aka the same as playerNumber)`);
    for (let w = round; w > -1; w--) {
      if (w !== round) {
        storyIHad = storyIHad - 1;
        console.log(`part a ... storyIHad is now ${storyIHad}`);
      }
      while (game[0].storyTexts[w][storyIHad] === "PLAYER BAILED") { //if player was deleted that round and didnt exist
        storyIHad = storyIHad - 1;
        console.log(`part b ... storyIHad is now ${storyIHad}`);
        while (playerNumber < 0) {
          storyIHad = storyIHad + game[0].originalPlayers.length;
          console.log(`part c ... storyIHad is now ${storyIHad}`);
        }
      }
      while (storyIHad < 0) { // if the number goes negative
        storyIHad = storyIHad + game[0].originalPlayers.length;
        console.log(`part d ... storyIHad is now ${storyIHad}`);
      }
      console.log(`part e ... storyIHad is now ${storyIHad}`);
    }
    console.log(`storyIHad is now ${storyIHad}`);
    while (storyInDeletedPlayersHands < 0) {
      storyInDeletedPlayersHands = storyInDeletedPlayersHands + game[0].originalPlayers.length; //this used to be game[0].players.length
    }
    console.log(storyInDeletedPlayersHands);
    game[0].storyBeginningsNotReturned.push(storyIHad);
    console.log(`the storyBeginningsNotReturned array is now ${game[0].storyBeginningsNotReturned}`);

    //toDelete is the player we are removing
    // storiesSubmitted, storiesReturned, and storyTexts
    // later we can figure out how to do this if theyve already submitted story or something (could check and see)
    //IM CHANGING THE BELOW WHERE IT DELETES EVERY ONE THEY SUBMITTED
    
    //You need to add 1 for every player lower than this one who's been deleted
    let counter = 0; //I believe this whole counter is outdated now
    for (let k = 0; k < game[0].deletedPlayersNumbers.length; k++) {
      if (game[0].deletedPlayersNumbers[k] < toDelete) {
        counter = counter + 1;
      }
    }

    toDelete = toDelete + counter; //This part might alos be outdated

    for (let v = round; v < game[0].rounds; v++) {
    // for (let v = 0; v < game[0].rounds; v++) {
      // console.log(`game[0].storiesSubmitted[v][toDelete] is ${game[0].storiesSubmitted[v][toDelete]}`);
      console.log(`game[0].storiesSubmitted[v][playerNumber] is ${game[0].storiesSubmitted[v][playerNumber]}`);
      // game[0].storiesSubmitted[v][toDelete] = true;
      // game[0].storiesReturned[v][toDelete] = true;
      //for current round, check to see if player has submitted story. if they have, don't delete (could do this for all - if not false, dont delete)
      // game[0].storyTexts[v].splice(toDelete, 1);
      // game[0].storyTexts[v][toDelete] = "PLAYER BAILED";
      game[0].storyTexts[v][playerNumber] = "PLAYER BAILED";
    }

    for (let x = 0; x < game[0].rounds; x++) {
        // game[0].storiesSubmitted[x][toDelete] = true;
        // game[0].storiesReturned[x][toDelete] = true;
        game[0].storiesSubmitted[x][playerNumber] = true;
        game[0].storiesReturned[x][playerNumber] = true;
      }

    //ADD IN SOMETHING SO GAME KNOWS TO CHANGE THE PASSING SEQUENCES?

    //so the player after would not be the "toDelete" number
    game[0].playerDeleted = true;
    game[0].deletedPlayersNumbers.push(playerNumber);
    console.log(`the deletedPlayers array is now ${game[0].deletedPlayersNumbers}`);
    game[0].markModified('storiesSubmitted');
    game[0].markModified('storiesReturned');
    game[0].markModified('storyTexts');
    game[0].markModified('playerDeleted');
    game[0].markModified('players');
    game[0].markModified('deletedPlayersNumbers');
    game[0].markModified('storyBeginningsNotReturned');
    game[0].save();
    console.log(game[0]);
    res.json(game);
  });
});


module.exports = router;
