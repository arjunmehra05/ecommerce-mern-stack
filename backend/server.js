// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const colors = require('colors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB Atlas
connectDB();

/* ---------- MIDDLEWARE ---------- */
// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, process.env.CLIENT_URL?.replace('https://', 'http://')]
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`.blue);
    next();
  });
}

/* ---------- ROUTES ---------- */
// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MERN E-commerce API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running and database is connected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      allowedOrigins: corsOptions.origin
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));

// Add cart routes if available
try {
  app.use('/api/cart', require('./routes/cart'));
  console.log('✅ Cart routes loaded'.green);
} catch (error) {
  console.log('⚠️  Cart routes not found - skipping'.yellow);
}

// Add order routes if available
try {
  app.use('/api/orders', require('./routes/orders'));
  console.log('✅ Order routes loaded'.green);
} catch (error) {
  console.log('⚠️  Order routes not found - skipping'.yellow);
}

/* ---------- ERROR HANDLING ---------- */
// Route not found middleware
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      health: '/api/health',
      auth: '/api/auth/*',
      products: '/api/products/*',
      admin: '/api/admin/*'
    }
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global Error Handler:'.red.bold, error.message);
  
  let message = error.message || 'Something went wrong';
  let statusCode = error.statusCode || 500;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    message = messages.join(', ');
    statusCode = 400;
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate entry';
    statusCode = 400;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (error.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      error: error 
    })
  });
});

/* ---------- SERVER STARTUP ---------- */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server Status:'.cyan.bold);
  console.log(`   ✅ Server running on port ${PORT}`.green);
  console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`.blue);
  console.log(`   🔗 Health Check: http://localhost:${PORT}/api/health`.yellow);
  console.log(`   🌐 CORS Origin: ${JSON.stringify(corsOptions.origin)}`.magenta);
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`.red.bold);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`❌ Uncaught Exception: ${err.message}`.red.bold);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;
