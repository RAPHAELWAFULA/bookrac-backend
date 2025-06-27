// routes/userAction.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/user');

router.post('/like', verifyToken, async (req, res) => {
  const { bookId, title, authors, description, thumbnail } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookData = {
      bookId,
      title,
      authors,
      description,
      thumbnail
    };

    if (!user.likedBooks.some(b => b.bookId === bookId)) {
      user.likedBooks.push(bookData);
      user.favouriteBooks.push(bookData);
      user.activityLog.push({
        action: 'liked',
        bookId,
        title,
        timestamp: new Date()
      });
    }

    await user.save();
    res.status(200).json({ message: 'Book liked and saved.' });
  } catch (err) {
    console.error('Like Error:', err);
    res.status(500).json({ message: 'Error liking book', error: err.message });
  }
});

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
