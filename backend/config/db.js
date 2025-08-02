// backend/config/db.js
const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try {
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(`📊 Database: ${conn.connection.name}`.green.bold);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB Atlas'.green);
    });

    mongoose.connection.on('error', (err) => {
      console.log('❌ Mongoose connection error:', err.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected'.yellow);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed through app termination'.red);
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`.red.underline.bold);
    
    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
