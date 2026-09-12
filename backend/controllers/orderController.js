const Order = require('../models/Order');
const Product = require('../models/Product');

const buildReference = () => 'WO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();

async function generateUniqueReference(maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const ref = buildReference();
    const exists = await Order.findOne({ reference: ref });
    if (!exists) return ref;
  }
  return buildReference() + '-' + Date.now().toString(36).slice(-3).toUpperCase();
}

exports.createOrder = async (req, res) => {
  try {
    const { customer, items, deliveryCharge } = req.body;
    if (!customer || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Customer and at least one item are required' });
    }

    // Server-side customer field validation
    if (!customer.fullName || !/^[a-zA-Z\s]+$/.test(customer.fullName.trim())) {
      return res.status(400).json({ message: 'Valid name is required (letters only)' });
    }
    if (!customer.age || Number(customer.age) < 1 || Number(customer.age) > 120) {
      return res.status(400).json({ message: 'Valid age is required (1-120)' });
    }
    if (!customer.city || !/^[a-zA-Z\s]+$/.test(customer.city.trim())) {
      return res.status(400).json({ message: 'Valid city is required (letters only)' });
    }
    if (!customer.address || customer.address.trim().length < 5) {
      return res.status(400).json({ message: 'Valid address is required' });
    }
    if (!customer.whatsapp || !/^\+?[0-9]{7,15}$/.test(customer.whatsapp.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Valid WhatsApp number is required (7-15 digits)' });
    }
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return res.status(400).json({ message: 'Valid email address is required' });
    }

    // Resolve product snapshots + validate stock/size + decrement stock
    const resolvedItems = [];
    let total = 0;
    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product) return res.status(400).json({ message: `Product ${it.product} not found` });
      if (!product.sizes.includes(it.size)) {
        return res.status(400).json({ message: `Size ${it.size} not available for ${product.name}` });
      }
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      if (product.stock > 0 && product.stock < qty) {
        return res.status(400).json({ message: `Only ${product.stock} left in stock for ${product.name}` });
      }
      resolvedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        size: it.size,
        quantity: qty,
        image: product.image,
        shoePhone: it.shoePhone || '',
      });
      total += product.price * qty;
    }

    // Decrement stock after validation passes
    for (const it of resolvedItems) {
      const product = await Product.findById(it.product);
      if (product && product.stock > 0) {
        product.stock = Math.max(0, product.stock - it.quantity);
        product.inStock = product.stock > 0;
        await product.save();
      }
    }

    const delivery = Number(deliveryCharge) || 0;
    const reference = await generateUniqueReference();
    const order = new Order({
      customer: {
        fullName: customer.fullName,
        age: Number(customer.age),
        city: customer.city,
        address: customer.address,
        whatsapp: customer.whatsapp,
        email: customer.email,
        gender: customer.gender,
      },
      items: resolvedItems,
      totalAmount: total,
      deliveryCharge: delivery,
      status: 'Order Placed',
      reference,
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { month, year, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (month && year) {
      const m = parseInt(month, 10) - 1;
      const y = parseInt(year, 10);
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, courier } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) order.status = status;
    if (courier !== undefined) order.courier = courier;
    if (status === 'Completed' && !order.deliveredAt) order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
