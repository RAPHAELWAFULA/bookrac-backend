const express = require('express');
const router = express.Router();

const { signup, signin, getUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected route
router.get('/user', verifyToken, getUser);

module.exports = router;
