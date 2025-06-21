// routes/userActions.js
const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middleware/verifyToken');

// Controller functions
const {
  likeBook,
  favouriteBook,
  removeBook,
} = require('../controllers/userActions');

// ✅ Protected user activity routes
router.post('/like', verifyToken, likeBook);
router.post('/favourite', verifyToken, favouriteBook);
router.post('/remove', verifyToken, removeBook);

module.exports = router;
