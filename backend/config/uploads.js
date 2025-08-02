// backend/config/uploads.js
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory'.green);
  }
};

module.exports = createUploadsDir;
