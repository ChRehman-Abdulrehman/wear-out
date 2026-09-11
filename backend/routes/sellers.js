const express = require('express');
const router = express.Router();
const { shopkeeperProtect } = require('../middleware/shopkeeperAuth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../middleware/upload');

// All routes require shopkeeper auth
router.use(shopkeeperProtect);

// Products - shopkeeper's own only
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find({ shopkeeper: req.shopkeeper._id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments({ shopkeeper: req.shopkeeper._id }),
    ]);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products', upload.array('images', 10), async (req, res) => {
  try {
    const { name, description, price, sizes, category, gender, inStock, stock, featured } = req.body;
    let parsedSizes = sizes;
    if (typeof sizes === 'string') parsedSizes = sizes.split(',').map((s) => s.trim()).filter(Boolean);
    let imageUrl = '';
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(req.files.map((f) => uploadToCloudinary(f)));
      images = uploads.map((r) => r.secure_url);
      imageUrl = images[0] || '';
    } else if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
      images = [imageUrl];
    }
    const stockNum = stock !== undefined ? Number(stock) : 0;
    const product = new Product({
      name,
      description,
      price: Number(price),
      sizes: parsedSizes && parsedSizes.length ? parsedSizes : ['S', 'M', 'L', 'XL'],
      category,
      gender: gender || 'Unisex',
      image: imageUrl,
      images,
      inStock: stockNum > 0 ? true : (inStock === 'false' || inStock === false ? false : true),
      stock: stockNum,
      featured: false,
      shopkeeper: req.shopkeeper._id,
      shopName: req.shopkeeper.shopName,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/products/:id', upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, shopkeeper: req.shopkeeper._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, sizes, category, gender, inStock, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (gender !== undefined) product.gender = gender;
    if (stock !== undefined) {
      product.stock = Number(stock);
      product.inStock = product.stock > 0;
    }
    if (sizes !== undefined) {
      let parsed = typeof sizes === 'string' ? sizes.split(',').map((s) => s.trim()).filter(Boolean) : sizes;
      if (parsed.length) product.sizes = parsed;
    }
    if (inStock !== undefined && stock === undefined) product.inStock = inStock === 'false' || inStock === false ? false : true;
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(req.files.map((f) => uploadToCloudinary(f)));
      const newImages = uploads.map((r) => r.secure_url);
      product.images = [...(product.images || []), ...newImages];
      if (!product.image && product.images.length) product.image = product.images[0];
    } else if (req.file) {
      const result = await uploadToCloudinary(req.file);
      product.image = result.secure_url;
      if (!product.images || product.images.length === 0) product.images = [result.secure_url];
    }
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, shopkeeper: req.shopkeeper._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders - only orders containing this shopkeeper's products
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const myProducts = await Product.find({ shopkeeper: req.shopkeeper._id }).select('_id');
    const myProductIds = myProducts.map((p) => p._id);
    const filter = { 'items.product': { $in: myProductIds } };
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics - scoped to shopkeeper's own data
router.get('/analytics', async (req, res) => {
  try {
    const myProducts = await Product.find({ shopkeeper: req.shopkeeper._id }).select('_id');
    const myProductIds = myProducts.map((p) => p._id);
    const orders = await Order.find({ 'items.product': { $in: myProductIds } });

    const totalOrders = orders.length;
    const revenue = orders.filter((o) => o.status === 'Completed').reduce((s, o) => s + (o.total || 0), 0);
    const statusBreakdown = { Completed: 0, 'On Delivery': 0, Returned: 0, Cancelled: 0 };
    orders.forEach((o) => { if (statusBreakdown[o.status] !== undefined) statusBreakdown[o.status]++; });

    res.json({ totalOrders, revenue, statusBreakdown, totalProducts: myProducts.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Featured request - shopkeeper requests featured status for their product
router.put('/products/:id/request-featured', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, shopkeeper: req.shopkeeper._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.featuredPending = true;
    await product.save();
    res.json({ message: 'Featured request sent to admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Customers - from shopkeeper's own orders
router.get('/customers', async (req, res) => {
  try {
    const myProducts = await Product.find({ shopkeeper: req.shopkeeper._id }).select('_id');
    const myProductIds = myProducts.map((p) => p._id);
    const orders = await Order.find({ 'items.product': { $in: myProductIds } });

    const customerMap = new Map();
    orders.forEach((o) => {
      if (o.customer && o.customer.whatsapp) {
        customerMap.set(o.customer.whatsapp, o.customer);
      }
    });
    res.json(Array.from(customerMap.values()));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
