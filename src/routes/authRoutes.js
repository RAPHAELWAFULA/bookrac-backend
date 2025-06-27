const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Public Routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// Protected Routes
router.get('/user', verifyToken, authController.getUser);
router.post('/like', verifyToken, authController.likeBook);
router.get('/favourites', verifyToken, authController.getFavourites);

module.exports = router;
