const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: String,
  title: String,
  authors: [String],
  description: String,
  thumbnail: String,
});

module.exports = mongoose.models.Book || mongoose.model('Book', bookSchema);
