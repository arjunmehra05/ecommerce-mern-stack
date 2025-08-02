// routes/cart.js
const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], totalAmount: 0 });
    }

    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: parseInt(quantity),
        price: product.price
      });
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update cart item quantity
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = parseInt(quantity);

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
