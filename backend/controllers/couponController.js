const Coupon = require('../models/Coupon');

// Compute discount amount for a coupon against a subtotal (never exceeds subtotal)
function computeDiscount(coupon, subtotal) {
  let discount = 0;
  if (coupon.type === 'percent') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.value;
  }
  discount = Math.round(discount);
  return Math.max(0, Math.min(discount, subtotal));
}

// Returns { ok: true, coupon, discount } or { ok: false, message }
async function checkCoupon(code, subtotal) {
  if (!code || !String(code).trim()) return { ok: false, message: 'Enter a coupon code' };
  const coupon = await Coupon.findOne({ code: String(code).trim().toUpperCase() });
  if (!coupon) return { ok: false, message: 'Invalid coupon code' };
  if (!coupon.active) return { ok: false, message: 'This coupon is no longer active' };
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { ok: false, message: 'This coupon has expired' };
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, message: 'This coupon has reached its usage limit' };
  }
  if (subtotal < coupon.minOrder) {
    return { ok: false, message: `Minimum order of Rs ${coupon.minOrder.toLocaleString()} required for this coupon` };
  }
  const discount = computeDiscount(coupon, subtotal);
  if (discount <= 0) return { ok: false, message: 'Coupon does not apply to this order' };
  return { ok: true, coupon, discount };
}

// Public: validate at checkout
exports.validate = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const sub = Number(subtotal) || 0;
    const result = await checkCoupon(code, sub);
    if (!result.ok) return res.status(400).json({ message: result.message });
    res.json({
      ok: true,
      code: result.coupon.code,
      type: result.coupon.type,
      value: result.coupon.value,
      discount: result.discount,
      minOrder: result.coupon.minOrder,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin list
exports.list = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin create
exports.create = async (req, res) => {
  try {
    const { code, type, value, minOrder, maxDiscount, active, expiresAt, usageLimit, note } = req.body;
    if (!code || !String(code).trim()) return res.status(400).json({ message: 'Code is required' });
    const cleanCode = String(code).trim().toUpperCase();
    const exists = await Coupon.findOne({ code: cleanCode });
    if (exists) return res.status(400).json({ message: 'Coupon code already exists' });
    const val = Number(value);
    if (!Number.isFinite(val) || val <= 0) return res.status(400).json({ message: 'Valid value is required' });
    if (type === 'percent' && val > 100) return res.status(400).json({ message: 'Percent cannot exceed 100' });

    const coupon = new Coupon({
      code: cleanCode,
      type: type === 'fixed' || type === 'flat' ? 'fixed' : 'percent',
      value: val,
      minOrder: Number(minOrder) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      active: active === undefined ? true : active === true || active === 'true',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      usageLimit: Number(usageLimit) || 0,
      note: note || '',
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Coupon code already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin update
exports.update = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    const { type, value, minOrder, maxDiscount, active, expiresAt, usageLimit, note } = req.body;
    if (type !== undefined) coupon.type = type === 'fixed' || type === 'flat' ? 'fixed' : 'percent';
    if (value !== undefined) {
      const val = Number(value);
      if (!Number.isFinite(val) || val <= 0) return res.status(400).json({ message: 'Valid value is required' });
      if (coupon.type === 'percent' && val > 100) return res.status(400).json({ message: 'Percent cannot exceed 100' });
      coupon.value = val;
    }
    if (minOrder !== undefined) coupon.minOrder = Number(minOrder) || 0;
    if (maxDiscount !== undefined) coupon.maxDiscount = Number(maxDiscount) || 0;
    if (active !== undefined) coupon.active = active === true || active === 'true';
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (usageLimit !== undefined) coupon.usageLimit = Number(usageLimit) || 0;
    if (note !== undefined) coupon.note = note;
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin delete
exports.remove = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkCoupon = checkCoupon;
exports.computeDiscount = computeDiscount;
