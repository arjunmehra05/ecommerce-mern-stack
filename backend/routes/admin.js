// backend/routes/admin.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Configure multer for multiple image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, 'product_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Get admin dashboard stats
router.get('/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const activeProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });

    res.json({
      totalProducts,
      totalUsers,
      activeProducts,
      inactiveProducts
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get all products for admin
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Create product (Admin only)
router.post('/products', [adminAuth, upload.array('images', 5)], async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      subcategory, 
      brand, 
      stock, 
      specifications 
    } = req.body;
    
    const images = req.files ? req.files.map(file => file.filename) : [];

    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      subcategory,
      brand,
      images,
      stock: parseInt(stock),
      specifications: specifications ? JSON.parse(specifications) : []
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update product (Admin only)
router.put('/products/:id', [adminAuth, upload.array('images', 5)], async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      subcategory, 
      brand, 
      stock, 
      specifications,
      isActive 
    } = req.body;

    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle new images
    const newImages = req.files ? req.files.map(file => file.filename) : [];
    const existingImages = product.images || [];
    
    // Combine existing and new images
    const allImages = newImages.length > 0 ? newImages : existingImages;

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      subcategory,
      brand,
      stock: parseInt(stock),
      specifications: specifications ? JSON.parse(specifications) : [],
      images: allImages,
      isActive: isActive !== undefined ? isActive : product.isActive
    };

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Delete product (Admin only)
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get all users (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
