const express = require('express');
const {
  sendOtpToUser,
  verifyOtp,
  completeProfile,
} = require('../controllers/authController');
const { protectUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', sendOtpToUser);
router.post('/verify-otp', verifyOtp);
router.put('/complete-profile', protectUser, completeProfile);

module.exports = router;