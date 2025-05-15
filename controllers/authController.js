const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const sendOtp = require('../utils/sendOtp');

// @desc    Send OTP to user's phone number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtpToUser = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    res.status(400);
    throw new Error('Please provide a phone number');
  }

  // Check if user exists
  const userExists = await User.findOne({ phoneNumber });

  if (userExists && userExists.isProfileComplete) {
    // User exists and profile is complete, proceed with OTP
    const otpSent = await sendOtp(phoneNumber);

    if (otpSent) {
      res.status(200).json({
        message: 'OTP sent successfully',
        isProfileComplete: true,
      });
    } else {
      res.status(500);
      throw new Error('Failed to send OTP');
    }
  } else if (userExists && !userExists.isProfileComplete) {
    // User exists but profile is not complete
    res.status(200).json({
      message: 'User exists but profile is incomplete',
      isProfileComplete: false,
    });
  } else {
    // New user, send OTP
    const otpSent = await sendOtp(phoneNumber);

    if (otpSent) {
      res.status(200).json({
        message: 'OTP sent successfully',
        isProfileComplete: false,
      });
    } else {
      res.status(500);
      throw new Error('Failed to send OTP');
    }
  }
};

// @desc    Verify OTP and login/register user
// @route   POST /api/auth/verify-otp
// @access  Public
// controllers/authController.js
const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Please provide phone number and OTP'
    });
  }

  try {
    // Find the most recent OTP for the phone number
    const otpRecord = await Otp.findOne({ phoneNumber })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if user exists
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        phoneNumber,
        isProfileComplete: false
      });
    }

    // Generate token
    const token = generateToken(user._id);

// In verifyOtp function, update the response for profileComplete: true case
if (user.isProfileComplete) {
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      _id: user._id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      city: user.city,
      state: user.state,
      district: user.district,
      isProfileComplete: true
    },
    token,
    profileComplete: true
  });
} else {
      // User needs to complete profile
      return res.status(200).json({
        success: true,
        message: 'OTP verified. Please complete your profile',
        user: {
          _id: user._id,
          phoneNumber: user.phoneNumber,
          isProfileComplete: false
        },
        token,
        profileComplete: false
      });
    }

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
};

// @desc    Complete user profile
// @route   PUT /api/auth/complete-profile
// @access  Private (User)
const completeProfile = async (req, res) => {
  const { fullName, city, state, district } = req.body;

  if (!fullName || !city) {
    return res.status(400).json({
      success: false,
      message: 'Please provide full name and city'
    });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user profile
    user.fullName = fullName;
    user.city = city;
    user.state = state || null; // Make optional
    user.district = district || null; // Make optional
    user.isProfileComplete = true;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      user: {
        _id: updatedUser._id,
        phoneNumber: updatedUser.phoneNumber,
        fullName: updatedUser.fullName,
        city: updatedUser.city,
        state: updatedUser.state,
        district: updatedUser.district,
        isProfileComplete: updatedUser.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during profile completion'
    });
  }
};

module.exports = {
  sendOtpToUser,
  verifyOtp,
  completeProfile,
};