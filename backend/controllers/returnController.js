const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');

// Public — customer submits a return/exchange request
exports.create = async (req, res) => {
  try {
    const { orderReference, type, reason, fullName, whatsapp } = req.body;
    if (!orderReference || !String(orderReference).trim()) {
      return res.status(400).json({ message: 'Order reference is required' });
    }
    if (!reason || String(reason).trim().length < 5) {
      return res.status(400).json({ message: 'Please describe the reason (min 5 chars)' });
    }
    if (!fullName || !/^[a-zA-Z\s]+$/.test(String(fullName).trim())) {
      return res.status(400).json({ message: 'Valid name is required (letters only)' });
    }
    const phone = String(whatsapp || '').replace(/\s/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(phone)) {
      return res.status(400).json({ message: 'Valid WhatsApp number is required' });
    }

    const ref = String(orderReference).trim().toUpperCase();
    const order = await Order.findOne({ reference: ref }).select('reference');
    if (!order) return res.status(404).json({ message: 'Order not found with that reference' });

    const rr = await ReturnRequest.create({
      orderReference: ref,
      type: type === 'Exchange' ? 'Exchange' : 'Return',
      reason: String(reason).trim(),
      customer: { fullName: String(fullName).trim(), whatsapp: phone },
    });
    res.status(201).json({ message: 'Request submitted — we will WhatsApp you shortly', request: rr });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin list
exports.list = async (req, res) => {
  try {
    const items = await ReturnRequest.find().sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin update status
exports.update = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ['Pending', 'Approved', 'Rejected', 'Done'];
    if (status && !allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const item = await ReturnRequest.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Request not found' });
    if (status) item.status = status;
    if (adminNote !== undefined) item.adminNote = adminNote;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
