const client = require('../config/twilio');
const Otp = require('../models/Otp');

const sendOtp = async (phoneNumber) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save OTP to database
    await Otp.create({
      phoneNumber,
      otp,
    });

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP for learning platform is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

module.exports = sendOtp;