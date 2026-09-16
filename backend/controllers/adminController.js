const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Ensure a single admin exists, seeded from env on first boot.
exports.ensureAdminExists = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await Admin.create({ email: process.env.ADMIN_EMAIL, passwordHash: hash });
    console.log('Seeded default admin from environment.');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    res.json({ token, email: admin.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  res.json({ email: req.admin.email });
};

// Public, safe config consumed by the frontend (no secrets).
exports.getPublicConfig = async (req, res) => {
  res.json({
    brand: 'Wear Out',
    tagline: 'WEAR YOUR CONFIDENCE',
    contact: {
      whatsapp: process.env.CONTACT_WHATSAPP || '',
      email: process.env.CONTACT_EMAIL || '',
      facebook: process.env.CONTACT_FACEBOOK || '',
      instagram: process.env.CONTACT_INSTAGRAM || '',
      whatsappCommunity: process.env.CONTACT_WHATSAPP_COMMUNITY || '',
    },
    deliveryCharge: Number(process.env.DELIVERY_CHARGE || 0),
    categories: [
      { name: 'Shirts', comingSoon: false },
      { name: 'Trousers', comingSoon: false },
      { name: 'Caps', comingSoon: false },
      { name: 'Watches', comingSoon: true },
      { name: 'Accessories', comingSoon: true },
      { name: 'Shoes', comingSoon: true },
    ],
  });
};
