const mongoose = require('mongoose');

let Player = require('./Player').schema;

const GameSchema = new mongoose.Schema({
    host: {
        type: String,
        default: "Host"
    },
    code: {
        type: String
    },
    rounds: {
      type: Number,
      default: 3
    },
    currentRound: {
      type: Number,
      default: 1
    },
    gameStarted: {
      type: Boolean,
      default: false
    },
    game_completed: {
        type: Boolean,
        default: false
    },
    players: [Player],
    storiesReturned: [],
    storiesSubmitted: []
});

module.exports = mongoose.model('game', GameSchema);
