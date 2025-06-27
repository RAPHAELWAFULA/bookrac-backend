const mongoose = require('mongoose');

// Embedded book schema
const BookSchema = new mongoose.Schema({
  bookId: String,
  title: String,
  authors: [String],
  thumbnail: String,
  description: String,
  // add more fields if needed
}, { _id: false }); // prevent nested _id

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  likedBooks: [BookSchema],        // ✅ Embedded book objects
  favouriteBooks: [BookSchema],    // ✅ Embedded book objects
  activityLog: [
    {
      action: String,
      bookId: String,
      title: String,
      date: {
        type: Date,
        default: Date.now,
      },
    }
  ],
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
