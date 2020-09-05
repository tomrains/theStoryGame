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
    game.gameStarted = true;
    let rounds = game.rounds;
    //Initialize submission array
    let submitLocation = game.storiesSubmitted;
    let submissionArray = [];
    for (let i = 0; i < rounds; i++) {
      let roundArray = [];
      for (let q = 0; q < game.players.length; q++) {
        roundArray.push(false);
        console.log("false added!");
      }
      submissionArray.push(roundArray);
      console.log("player array of falses added")
    }
    game.storiesSubmitted = submissionArray;

    // Initialize returned array
    let returnLocation = game.storiesReturned;
    let returnArray = [];
    for (let t = 0; t < rounds; t++) {
      let roundArray2 = [];
      for (let v = 0; v < game.players.length; v++) {
        roundArray2.push(false);
        console.log("false added!");
      }
      returnArray.push(roundArray2);
      console.log("player array of falses added")
    }
    game.storiesReturned = returnArray;

    // Initialize storyText array where stories will be stored
    let draftsLocation = game.storyTexts;
    let storiesArray = [];
    for (let r = 0; r < rounds; r++) {
      let storiesArray2 = [];
      for (let s = 0; s < game.players.length; s++) {
        storiesArray.push(false);
        console.log("false added!");
      }
      storiesArray.push(storiesArray2);
      console.log("story array of falses added")
    }
    game.storyTexts = returnArray;
    game.markModified('storiesSubmitted');
    game.markModified('storiesReturned');
    game.markModified('storyTexts');
    game.save();
    console.log(game.storiesSubmitted);
    console.log(game.storiesReturned);
    console.log(game.storyTexts);
    res.json(game);
  });
});

module.exports = router;
