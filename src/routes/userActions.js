const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/user');

// Save liked book
router.post('/like', verifyToken, async (req, res) => {
  const { bookId, title, authors, thumbnail } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookData = { bookId, title, authors, thumbnail };

    // Check if the book is already liked
    const exists = user.likedBooks.some(b => b.bookId === bookId);

    if (!exists) {
      user.likedBooks.push(bookData);
      user.favouriteBooks.push(bookData);
      user.activityLog.push({ action: 'liked', book: bookId });
    }

    await user.save();
    res.status(200).json({ message: 'Book liked and saved.' });
  } catch (err) {
    console.error('Like Error:', err);
    res.status(500).json({ message: 'Error liking book', error: err.message });
  }
});

// Get favourites
router.get('/favourites', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.favouriteBooks);
  } catch (err) {
    console.error('Favourites Error:', err);
    res.status(500).json({ message: 'Error fetching favourites', error: err.message });
  }
});

module.exports = router;
