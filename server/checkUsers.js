const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('\nExisting users:');
    users.forEach(u => {
      console.log(`Username: ${u.username}, Email: ${u.email}, Role: ${u.role}`);
    });

    console.log(`\nTotal users: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkUsers();