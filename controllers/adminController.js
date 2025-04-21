const Admin = require('../models/Admin');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ username });
  
      if (!admin) {
        return res.status(401).json({
          message: 'Invalid credentials - admin not found'
        });
      }
  
      const isMatch = await admin.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid credentials - password incorrect'
        });
      }
  
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
  
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
        message: 'Server error during authentication'
      });
    }
  };

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.fullName = req.body.fullName || user.fullName;
    user.city = req.body.city || user.city;
    user.isProfileComplete = req.body.isProfileComplete !== undefined ? 
      req.body.isProfileComplete : user.isProfileComplete;

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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  authAdmin,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};