const User = require('../models/user');
const Book = require('../models/Book');

// Helper to log activity
const logActivity = async (userId, bookId, action) => {
  await User.findByIdAndUpdate(userId, {
    $push: {
      activityLog: { action, book: bookId },
    },
  });
};

// Like a book
exports.likeBook = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { likedBooks: bookId },
    });

    await logActivity(userId, bookId, 'liked');

    res.status(200).json({ message: 'Book liked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to favourites
exports.favouriteBook = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { favouriteBooks: bookId },
    });

    await logActivity(userId, bookId, 'favourited');

    res.status(200).json({ message: 'Book added to favourites' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a book
exports.removeBook = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: {
        likedBooks: bookId,
        favouriteBooks: bookId,
      },
    });

    await logActivity(userId, bookId, 'removed');

    res.status(200).json({ message: 'Book removed from lists' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
