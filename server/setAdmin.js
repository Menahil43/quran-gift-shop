const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config();

const setAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'qurangiftboxes@gmail.com';
    const user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`Success: ${email} is now an Admin!`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setAdmin();
