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
    game.save(game.players.push(hostPlayer));
    res.json(`You just added a new player`);
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
    game.players[playerNumber].number = playerNumber;
    game.save();
    res.json(game.players[playerNumber].number);
  });
});

// @route   GET api/players/:code/player
// @desc    Fetch players that have signed up in a particular game (for waitscreen)
// @check   Passed
router.get('/:code/player', (req, res) => {
  let code = req.params.code;
  Game.find({code: code}, function(err, game) {
    console.log(game);
    res.json(game);
  });
});

module.exports = router;
