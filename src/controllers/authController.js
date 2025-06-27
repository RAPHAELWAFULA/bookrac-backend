const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// SIGNIN
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET USER INFO
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user info' });
  }
};

// LIKE BOOK
exports.likeBook = async (req, res) => {
  try {
    const { bookId, title, authors, description, thumbnail } = req.body;

    if (!bookId || !title) {
      return res.status(400).json({ message: 'Missing required book fields' });
    }

    const bookData = {
      bookId,
      title,
      authors,
      description,
      thumbnail,
    };

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyLiked = user.likedBooks.some(b => b.bookId === bookId);

    if (!alreadyLiked) {
      user.likedBooks.push(bookData);
      user.favouriteBooks.push(bookData);
      user.activityLog.push({ action: 'Liked and added', bookId, title });

      user.likedBooks = Array.from(
        new Map(user.likedBooks.map(book => [book.bookId, book])).values()
      );

      user.favouriteBooks = Array.from(
        new Map(user.favouriteBooks.map(book => [book.bookId, book])).values()
      );

      await user.save();
    }

    return res.status(200).json({ message: 'Liked!' });
  } catch (err) {
    console.error('🔥 LIKE CONTROLLER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// 🔥 NEW: GET FAVOURITE BOOKS
exports.getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.favouriteBooks || []);
  } catch (err) {
    console.error('❌ Failed to fetch favourites:', err);
    res.status(500).json({ message: 'Server error while fetching favourites' });
  }
};
