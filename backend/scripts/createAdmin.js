// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const colors = require('colors');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...'.yellow);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB'.green);

    // Admin user details - CHANGE THESE!
    const adminData = {
      name: 'Admin User',
      email: 'admin@ecommerce.com',  // Change this email
      password: 'Admin123!@#',        // Change this password
      role: 'admin'
    };

    console.log('🔍 Checking if admin already exists...'.yellow);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email'.red);
      console.log(`📧 Email: ${adminData.email}`.cyan);
      if (existingAdmin.role === 'admin') {
        console.log('✅ User already has admin role'.green);
      } else {
        console.log('🔄 Updating user role to admin...'.yellow);
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ User role updated to admin'.green);
      }
      process.exit(0);
    }

    console.log('🔐 Hashing password...'.yellow);
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    console.log('👤 Creating admin user...'.yellow);
    // Create admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });

    await admin.save();
    
    console.log('🎉 Admin user created successfully!'.green.bold);
    console.log('📋 Admin Credentials:'.cyan.bold);
    console.log(`   📧 Email: ${adminData.email}`.cyan);
    console.log(`   🔑 Password: ${adminData.password}`.cyan);
    console.log(`   👤 Role: ${adminData.role}`.cyan);
    console.log('');
    console.log('🚀 You can now login to the admin panel!'.green);
    console.log('🌐 Admin Panel URL: /admin/dashboard'.magenta);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:'.red.bold, error.message);
    if (error.code === 11000) {
      console.log('💡 This usually means the email already exists in the database'.yellow);
    }
    process.exit(1);
  }
};

// Run the script
console.log('🚀 Starting admin creation process...'.cyan.bold);
createAdmin();
