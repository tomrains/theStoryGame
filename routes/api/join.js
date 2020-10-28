const express = require('express');
const router = express.Router();

const Game = require('../../models/Game');

// @route   GET join/API
// @desc    Test route
// @check   Passed
router.get('/', (req, res) => res.send('Join route'));

// @route   GET join/api/:code
// @desc    Get a game's info by ID
// @check   Passed
router.get('/:code', (req, res) => {
  let code = req.params.code;
  Game.find({code: code}, function(err, game) {
    let counter = 0;
    console.log(game);
    console.log(game[0]);
    if (!game || err || game[0] === undefined) {
      console.log("error found");
      let gameInfo = [{
          rounds: 3,
          hasGameStarted: false,
          doesGameExist: false
      }];
      // console.log(gameInfo);
      // console.log(gameInfo.data);
      // console.log(gameInfo.data[0]);
      // console.log(gameInfo.data[0].rounds);
      res.json(gameInfo);
      counter = counter + 1;
      return;
    }
    console.log(`counter is ${counter}`);
    console.log("sending over game info");
    console.log(game);
    res.json(game);
  });
});

module.exports = router;
