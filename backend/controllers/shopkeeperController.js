const Shopkeeper = require('../models/Shopkeeper');
const { shopkeeperSign } = require('../middleware/shopkeeperAuth');

exports.signup = async (req, res) => {
  try {
    const { shopName, ownerName, phone, email, password, city, address, cnic } = req.body;
    if (!shopName || !ownerName || !phone || !email || !password)
      return res.status(400).json({ message: 'Shop name, owner name, phone, email and password are required' });

    const exists = await Shopkeeper.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const shopkeeper = await Shopkeeper.create({
      shopName, ownerName, phone, email, password,
      city: city || '', address: address || '', cnic: cnic || '',
    });

    res.status(201).json({
      message: 'Signup successful. Your account is pending admin approval.',
      shopkeeper: { id: shopkeeper._id, shopName: shopkeeper.shopName, status: shopkeeper.status },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const shopkeeper = await Shopkeeper.findOne({ email });
    if (!shopkeeper) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await shopkeeper.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    if (shopkeeper.status === 'pending')
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    if (shopkeeper.status === 'rejected')
      return res.status(403).json({ message: 'Your account has been rejected' });
    if (shopkeeper.status === 'suspended')
      return res.status(403).json({ message: 'Your account has been suspended' });

    const token = shopkeeperSign(shopkeeper);
    res.json({ token, shopkeeper: { id: shopkeeper._id, shopName: shopkeeper.shopName, ownerName: shopkeeper.ownerName, email: shopkeeper.email, status: shopkeeper.status } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ shopkeeper: req.shopkeeper });
};

// Admin: get all shopkeepers
exports.getAll = async (req, res) => {
  try {
    const shopkeepers = await Shopkeeper.find().select('-password').sort({ createdAt: -1 });
    res.json(shopkeepers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: get pending shopkeepers
exports.getPending = async (req, res) => {
  try {
    const shopkeepers = await Shopkeeper.find({ status: 'pending' }).select('-password').sort({ createdAt: -1 });
    res.json(shopkeepers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: approve/reject/suspend shopkeeper
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'suspended'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const shopkeeper = await Shopkeeper.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!shopkeeper) return res.status(404).json({ message: 'Shopkeeper not found' });
    res.json(shopkeeper);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
