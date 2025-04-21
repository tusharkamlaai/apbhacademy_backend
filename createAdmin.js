// createAdmin.js
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await Admin.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('Admin already exists:', adminExists);
      return;
    }

    const admin = await Admin.create({
      username: 'admin',
      password: 'admin@123' // This will be automatically hashed by the pre-save hook
    });

    console.log('Admin created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();