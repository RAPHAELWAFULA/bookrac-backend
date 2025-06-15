const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  likedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    }
  ],

  favouriteBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    }
  ],

  activityLog: [
    {
      action: {
        type: String,
        enum: ['added', 'removed', 'liked', 'unliked', 'favourited', 'unfavourited'],
      },
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }
  ],
});

module.exports = mongoose.model('User', userSchema);
