const Order = require('../models/Order');
const Product = require('../models/Product');

const buildReference = () => 'WO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();

exports.createOrder = async (req, res) => {
  try {
    const { customer, items, deliveryCharge } = req.body;
    if (!customer || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Customer and at least one item are required' });
    }

    // Resolve product snapshots + validate stock/size
    const resolvedItems = [];
    let total = 0;
    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product) return res.status(400).json({ message: `Product ${it.product} not found` });
      if (!product.sizes.includes(it.size)) {
        return res.status(400).json({ message: `Size ${it.size} not available for ${product.name}` });
      }
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
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

    const delivery = Number(deliveryCharge) || 0;
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
      reference: buildReference(),
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (month && year) {
      const m = parseInt(month, 10) - 1;
      const y = parseInt(year, 10);
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
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
