// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      if (existing.role === 'admin') {
        console.log('Admin user already exists'.green);
        process.exit(0);
      } else {
        existing.role = 'admin';
        await existing.save();
        console.log('Updated user to admin role'.cyan);
        process.exit(0);
      }
    }

    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com', // replace email as desired
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    console.log('Admin user created:'.green);
    console.log(`Email: admin@example.com`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message.red);
    process.exit(1);
  }
};

createAdmin();
