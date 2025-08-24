// backend/routes/authRoutes.js
const express = require('express');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// auth
router.post('/register', register);
router.post('/login', login);

// profile
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
