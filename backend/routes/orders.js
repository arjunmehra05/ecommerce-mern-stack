// backend/routes/orders.js
const express = require('express');
const router = express.Router();

// Add order routes here

// Example route:
router.get('/', (req, res) => {
  res.json({ message: 'Orders endpoint works!' });
});

module.exports = router;
