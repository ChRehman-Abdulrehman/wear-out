const Order = require('../models/Order');

// Public order tracking — lookup by reference or phone (WhatsApp number)
exports.track = async (req, res) => {
  try {
    const { reference, phone } = req.body;
    const filter = {};
    if (reference && String(reference).trim()) {
      filter.reference = String(reference).trim().toUpperCase();
    } else if (phone && String(phone).trim()) {
      filter['customer.whatsapp'] = String(phone).replace(/\s/g, '');
    } else {
      return res.status(400).json({ message: 'Enter your order reference or phone number' });
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('reference status createdAt totalAmount deliveryCharge coupon items customer.fullName itemCount');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for that reference or phone number' });
    }

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
