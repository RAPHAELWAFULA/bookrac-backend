const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/user');

// Save liked book
router.post('/like', verifyToken, async (req, res) => {
  const { bookId, title, authors, thumbnail } = req.body;
  try {
    const user = await User.findById(req.user.id);

    const bookData = { _id: bookId, title, authors, thumbnail };

    // Prevent duplicates
    const exists = user.likedBooks.some(b => b._id === bookId);
    if (!exists) {
      user.likedBooks.push(bookData);
      user.favouriteBooks.push(bookData);
      user.activityLog.push({ action: 'liked', book: bookId });
    }

    await user.save();
    res.status(200).json({ message: 'Book liked and saved.' });
  } catch (err) {
    res.status(500).json({ message: 'Error liking book', error: err.message });
  }
});

// Get favourites
router.get('/favourites', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.favouriteBooks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favourites', error: err.message });
  }
});

module.exports = router;
