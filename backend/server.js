// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const colors = require('colors');

const connectDB = require('./config/db');

const app = express();
connectDB();

// Dynamic CORS origins for dev and prod
const allowedOrigins = [];
if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
  allowedOrigins.push(process.env.CLIENT_URL.replace(/^https:/, 'http:'));
} else {
  allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
}

app.use(cors({
  origin: ['https://ecommerce-mern-stack-frontend-vuu8.onrender.com/', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`.cyan);
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));

// Optionally handle other routes if exist
try {
  app.use('/api/cart', require('./routes/cart'));
} catch {}
try {
  app.use('/api/orders', require('./routes/orders'));
} catch {}

app.use('*', (req,res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' not found` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message.red.bold);

  let message = err.message || "Server Error";
  let statusCode = err.statusCode || 500;

  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map(e => e.message).join(', ');
    statusCode = 400;
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for ${field}`;
    statusCode = 400;
  }
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`.green.bold);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection:'.red.bold, error);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', error => {
  console.error('Uncaught Exception:'.red.bold, error);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down…'.yellow);
  server.close(() => {
    console.log('Process terminated'.yellow);
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the MERN E-commerce backend API',
    timestamp: new Date().toISOString()
  });
});


module.exports = app;
