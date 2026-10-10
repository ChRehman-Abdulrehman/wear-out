const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const { addOrderConfirmationJob } = require('../queues/orderQueue');
const { pricing } = require('../utils/pricing');
const { checkCoupon } = require('./couponController');

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
    const { customer, items, deliveryCharge, couponCode } = req.body;
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

    // Validate all items first (no stock changes yet)
    const resolvedItems = [];
    let total = 0;
    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product) return res.status(400).json({ message: `Product ${it.product} not found` });
      if (!product.sizes.includes(it.size)) {
        return res.status(400).json({ message: `Size ${it.size} not available for ${product.name}` });
      }
      const qty = Math.max(1, Math.min(100, parseInt(it.quantity, 10) || 1));
      if (product.inStock === false) {
        return res.status(400).json({ message: `${product.name} is currently out of stock` });
      }
      // Stock is only enforced when a positive count is tracked (0 = unlimited)
      const tracked = Number(product.stock) > 0;
      if (tracked && product.stock < qty) {
        return res.status(400).json({ message: `Only ${product.stock} left in stock for ${product.name}` });
      }
      // Sale price wins when active — customers always pay the lower active price
      const sell = pricing(product).current;
      resolvedItems.push({
        product: product._id,
        name: product.name,
        price: sell,
        size: it.size,
        quantity: qty,
        image: product.image,
        shoeSize: it.shoeSize || '',
        tracked,
      });
      total += sell * qty;
    }

    // Coupon — validated server-side before any stock changes
    let discount = 0;
    let couponDoc = null;
    if (couponCode && String(couponCode).trim()) {
      const check = await checkCoupon(couponCode, total);
      if (!check.ok) return res.status(400).json({ message: check.message });
      discount = check.discount;
      couponDoc = check.coupon;
    }
    const payable = Math.max(0, total - discount);

    // Aggregate duplicate items to prevent double-decrement bypass
    const aggregated = {};
    for (const it of resolvedItems) {
      const key = `${it.product}-${it.size}-${it.shoeSize}`;
      if (aggregated[key]) {
        aggregated[key].quantity += it.quantity;
      } else {
        aggregated[key] = { ...it };
      }
    }
    const aggItems = Object.values(aggregated);

    // Atomic stock decrement for tracked items only, with rollback on failure
    const decremented = [];
    for (const it of aggItems) {
      if (!it.tracked) continue; // unlimited stock — nothing to decrement
      const updated = await Product.findOneAndUpdate(
        { _id: it.product, stock: { $gte: it.quantity } },
        { $inc: { stock: -it.quantity } },
        { new: true }
      );
      if (!updated) {
        // Rollback: restore all previously decremented items
        for (const done of decremented) {
          await Product.updateOne({ _id: done.product }, { $inc: { stock: done.quantity } });
        }
        return res.status(400).json({ message: `Insufficient stock for ${it.name}` });
      }
      decremented.push(it);
      // Update inStock flag — tracked product that reached 0 becomes unavailable
      if (updated.stock <= 0) {
        await Product.updateOne({ _id: it.product }, { $set: { inStock: false } });
      } else if (!updated.inStock) {
        await Product.updateOne({ _id: it.product }, { $set: { inStock: true } });
      }
    }

    // Server-side delivery charge — free shipping threshold is admin-controlled
    let delivery = Number(process.env.DELIVERY_CHARGE) || 200;
    try {
      const cfgDelivery = await Settings.get('deliveryCharge', null);
      if (cfgDelivery !== null && cfgDelivery !== undefined && Number.isFinite(Number(cfgDelivery))) {
        delivery = Number(cfgDelivery);
      }
      const threshold = Number(await Settings.get('freeShippingThreshold', 0)) || 0;
      if (threshold > 0 && payable >= threshold) delivery = 0;
    } catch (e) { /* settings optional */ }
    const reference = await generateUniqueReference();
    const order = new Order({
      customer: {
        fullName: customer.fullName,
        age: Number(customer.age),
        city: customer.city,
        address: customer.address,
        whatsapp: customer.whatsapp,
        email: customer.email,
        gender: customer.gender || 'Male',
      },
      items: aggItems.map(({ tracked, ...rest }) => rest),
      totalAmount: payable,
      coupon: { code: couponDoc ? couponDoc.code : '', discount },
      deliveryCharge: delivery,
      status: 'Order Placed',
      reference,
    });

    try {
      await order.save();
    } catch (saveErr) {
      // Rollback stock if order save fails
      for (const done of decremented) {
        await Product.updateOne({ _id: done.product }, { $inc: { stock: done.quantity } });
      }
      return res.status(400).json({ message: saveErr.message || 'Order validation failed' });
    }

    // Add order confirmation to background queue (graceful if Redis unavailable)
    try { await addOrderConfirmationJob(order._id); } catch (e) { /* queue optional */ }
    // Count coupon usage only after a successful save
    if (couponDoc) {
      try { await Coupon.updateOne({ _id: couponDoc._id }, { $inc: { usedCount: 1 } }); } catch (e) { /* non-critical */ }
    }
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { month, year, status, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const filter = {};
    if (status) filter.status = status;
    if (month && year) {
      const m = parseInt(month, 10) - 1;
      const y = parseInt(year, 10);
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    const skip = (pageNum - 1) * limitNum;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, courier } = req.body;
    const allowedStatuses = ['Order Placed', 'Processing', 'On Delivery', 'Completed', 'Returned', 'Cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
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
