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
    originalPlayers: [Player],
    deletedPlayersNumbers: [],
    removablePlayers: [Player],
    storyBeginningsNotReturned: [],
    playerDeleted: {
      type: Boolean,
      default: false
    },
    storiesSubmitted: [],
    storiesReturned: [],
    storyTexts: [],
    doesGameExist: {
      type: Boolean,
      default: true
    }
});

module.exports = mongoose.model('game', GameSchema);
