const express = require('express');
const router = express.Router();
const { signup, signin, getUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Public
router.post('/signup', signup);
router.post('/signin', signin);

// Protected
router.get('/user', verifyToken, getUser);

module.exports = router;
