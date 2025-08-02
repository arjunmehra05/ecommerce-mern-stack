// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('Admin user already exists'.green);
        process.exit(0);
      }
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Upgraded existing user to admin'.yellow);
      process.exit(0);
    }

    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Admin user created successfully:'.green);
    console.log(`Email: admin@example.com`);
    console.log(`Password: ${password}`);
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin user:', error.message.red.bold);
    process.exit(1);
  }
}

createAdmin();
