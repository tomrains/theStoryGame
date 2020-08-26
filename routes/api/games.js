const express = require('express');
const router = express.Router();

const Game = require('../../models/Game');

// @route   GET api/games
// @desc    Test route
// @check   Passed
router.get('/', (req, res) => res.send('Game route'));

// @route   POST api/games/add
// @desc    Immediately create game when homepage renders
// @check   Passed
router.post('/add', (req, res) => {
  let game = new Game(req.body);
  game.save()
    .then(game => {
      res.status(200).json({'game': 'game added successfully'});
    })
    .catch(err => {
      res.status(400).send('adding new game failed');
    });
});

// @route   PUT api/games/:code/startGame
// @desc    Host makes the game begin
// @check   Passed
router.put('/:code/startGame', (req, res) => {
  let code = req.params.code;
  Game.findOne({code: code}, function(err, game) {
    game.save(game.gameStarted = true);
    res.json(game);
  });
});

// @route   GET api/games/:code
// @desc    Get a game's info by ID
// @check   Passed
router.get('/:code', (req, res) => {
  let code = req.params.code;
  Game.find({code: code}, function(err, game) {
      res.json(game);
  });
});

module.exports = router;
