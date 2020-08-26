const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        default: -1
    },
    story: []
});

module.exports = mongoose.model('player', PlayerSchema);