const NotifyRequest = require('../models/NotifyRequest');
const Product = require('../models/Product');

// Public — "Notify me when back in stock"
exports.create = async (req, res) => {
  try {
    const { productId, contact } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product is required' });
    const clean = String(contact || '').trim();
    if (!clean) return res.status(400).json({ message: 'Phone or email is required' });
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
    const isPhone = /^\+?[0-9]{7,15}$/.test(clean.replace(/\s/g, ''));
    if (!isEmail && !isPhone) return res.status(400).json({ message: 'Enter a valid phone or email' });

    const product = await Product.findById(productId).select('name');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Dedupe — same product + same contact only once
    const exists = await NotifyRequest.findOne({ product: productId, contact: clean });
    if (exists) return res.json({ message: "You're already on the list for this item" });

    await NotifyRequest.create({ product: productId, productName: product.name, contact: clean });
    res.status(201).json({ message: "You'll be notified when it's back" });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin list
exports.list = async (req, res) => {
  try {
    const items = await NotifyRequest.find().sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
