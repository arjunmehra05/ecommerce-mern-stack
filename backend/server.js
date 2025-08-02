// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const colors = require('colors');

const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// Setup CORS based on environment and allowed origins
const allowedOrigins = [];

if (process.env.NODE_ENV === 'production') {
  if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
    allowedOrigins.push(process.env.CLIENT_URL.replace(/^https:/, 'http:'));
  }
} else {
  allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Middleware for parsing JSON & form submissions with size limits
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static uploads folder (for images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req,res,next) => {
    console.log(`${req.method} ${req.originalUrl}`.cyan);
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));

// Optional: Load cart and order routes if existent
try {
  app.use('/api/cart', require('./routes/cart'));
} catch (e) { /* Routes missing - ignore */ }

try {
  app.use('/api/orders', require('./routes/orders'));
} catch (e) { /* Routes missing - ignore */ }

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success:false,
    message: `Route '${req.originalUrl}' not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message.red.bold);

  let message = err.message || 'Server Error';
  let statusCode = err.statusCode || 500;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(v => v.message).join(', ');
    statusCode = 400;
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate ${field} entered`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`.green.bold);
});

// Graceful shutdown on fatal errors or disconnects
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err.message.red.bold);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message.red.bold);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully'.yellow);
  server.close(() => {
    console.log('Process terminated'.yellow);
  });
});

module.exports = app;
