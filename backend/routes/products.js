// backend/routes/products.js
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const Product = require('../models/Product');
const auth    = require('../middleware/auth');          // customer auth
const admin   = require('../middleware/adminAuth');     // admin auth

const router = express.Router();

/* ---------- Multer setup for admin image uploads ---------- */
const storage = multer.diskStorage({
  destination: './uploads/',
  filename   : (req, file, cb) =>
    cb(null, 'product_' + Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif/.test(
      path.extname(file.originalname).toLowerCase()
    ) && /jpeg|jpg|png|gif/.test(file.mimetype);
    cb(ok ? null : 'Error: Images Only!', ok);
  }
});

/* ---------- Public routes ---------- */
// GET /api/products            — list with filters & pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search
    } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .limit(+limit)
      .skip((+page - 1) * +limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages : Math.ceil(total / +limit),
      currentPage: +page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/products/:id        — single-product detail
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive)
      return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ message: 'Product not found' });
    res.status(500).send('Server error');
  }
});

/* ---------- Admin CRUD routes ---------- */
// POST /api/products           — create
router.post('/', [admin, upload.array('images', 5)], async (req, res) => {
  try {
    const {
      name, description, price, category, subcategory,
      brand, stock, specifications
    } = req.body;

    const images = req.files.map(f => f.filename);
    if (images.length === 0)
      return res.status(400).json({ message: 'At least one image required' });

    const product = await Product.create({
      name,
      description,
      price : +price,
      category,
      subcategory,
      brand,
      stock : +stock,
      images,
      specifications: specifications ? JSON.parse(specifications) : []
    });

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/products/:id        — update
router.put('/:id', [admin, upload.array('images', 5)], async (req, res) => {
  try {
    const {
      name, description, price, category, subcategory,
      brand, stock, specifications, isActive
    } = req.body;

    const images =
      req.files.length > 0
        ? req.files.map(f => f.filename)
        : undefined; // keep existing if none uploaded

    const updates = {
      name, description,
      price : price && +price,
      category, subcategory, brand,
      stock : stock && +stock,
      specifications: specifications && JSON.parse(specifications),
      images,
      isActive
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/products/:id
router.delete('/:id', admin, async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
