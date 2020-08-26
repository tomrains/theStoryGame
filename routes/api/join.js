const express = require('express');
const router = express.Router();

const Game = require('../../models/Game');

// @route   GET api/join
// @desc    Test route
// @check   Passed
router.get('/', (req, res) => res.send('Join route'));

// @route   GET api/games/:code
// @desc    Get a game's info by ID
// @check   Passed
router.get('/:code', (req, res) => {
  let code = req.params.code;
  Game.find({code: code}, function(err, game) {
    console.log("sending over game info");
      res.json(game);
  });
});

module.exports = router;
