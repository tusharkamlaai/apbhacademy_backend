const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
    },
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    signupIp: String,  // Store IP address
    lastLoginIp: String // Optional: track last login IP
  },
  {
    timestamps: true,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);