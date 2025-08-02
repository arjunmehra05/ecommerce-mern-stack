// backend/config/db.js
const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
      // Removed deprecated 'bufferMaxEntries'
    });

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`.cyan.bold);

    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose connected to MongoDB Atlas'.green);
    });

    mongoose.connection.on('error', err => {
      console.error('🔴 Mongoose connection error:', err.message.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('🟠 Mongoose disconnected'.yellow);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed due to app termination'.red);
      process.exit(0);
    });
  } catch (error) {
    console.error('🔥 MongoDB connection failed:', error.message.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
