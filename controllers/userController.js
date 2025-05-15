const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (User)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        city: user.city,
        state: user.state,         // Added state field
        district: user.district,   // Added district field
        isProfileComplete: user.isProfileComplete,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update all editable fields
    user.fullName = req.body.fullName || user.fullName;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.district = req.body.district || user.district;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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
    console.error('Profile update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};