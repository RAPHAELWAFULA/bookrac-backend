const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ✅ You forgot this line
const verifyToken = require('../middleware/verifyToken');

// Public
router.post('/signin', authController.signin);
router.post('/signup', authController.signup);

// Protected
router.get('/user', verifyToken, authController.getUser);

module.exports = router;
