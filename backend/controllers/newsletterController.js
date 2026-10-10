const Newsletter = require('../models/Newsletter');

// Public subscribe
exports.subscribe = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }
    const exists = await Newsletter.findOne({ email });
    if (exists) return res.json({ message: "You're already subscribed" });
    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed! Watch your inbox for drops.' });
  } catch (err) {
    if (err.code === 11000) return res.json({ message: "You're already subscribed" });
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin list
exports.list = async (req, res) => {
  try {
    const items = await Newsletter.find().sort({ createdAt: -1 }).limit(500);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
