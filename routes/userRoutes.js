const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);

module.exports = router;