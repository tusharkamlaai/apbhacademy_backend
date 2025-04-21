const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      index: { expires: '5m' }, // OTP expires after 5 minutes
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Otp', otpSchema);