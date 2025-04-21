const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (User)
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
      city: user.city,
      isProfileComplete: user.isProfileComplete,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.city = req.body.city || user.city;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      phoneNumber: updatedUser.phoneNumber,
      fullName: updatedUser.fullName,
      city: updatedUser.city,
      isProfileComplete: updatedUser.isProfileComplete,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};