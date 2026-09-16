const jwt = require('jsonwebtoken');
const Shopkeeper = require('../models/Shopkeeper');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

exports.shopkeeperSign = (shopkeeper) =>
  jwt.sign({ id: shopkeeper._id, role: 'shopkeeper' }, JWT_SECRET, { expiresIn: '7d' });

exports.shopkeeperProtect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET);
    if (decoded.role !== 'shopkeeper')
      return res.status(403).json({ message: 'Not a shopkeeper account' });

    const shopkeeper = await Shopkeeper.findById(decoded.id).select('-password');
    if (!shopkeeper) return res.status(401).json({ message: 'Shopkeeper not found' });
    if (shopkeeper.status !== 'approved')
      return res.status(403).json({ message: 'Account not yet approved by admin' });

    req.shopkeeper = shopkeeper;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.adminProtect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    if (decoded.role !== 'admin')
      return res.status(403).json({ message: 'Not an admin account' });

    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
