const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentProfile);

module.exports = router;