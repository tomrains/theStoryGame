const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    lines: {
        type: Array,
        default: []
    }
  });

module.exports = mongoose.model('story', StorySchema);