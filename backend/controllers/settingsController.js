const Settings = require('../models/Settings');

const PUBLIC_KEYS = ['deliveryCharge', 'freeShippingThreshold', 'saleBanner'];

// Public — store settings the frontend needs
exports.publicSettings = async (req, res) => {
  try {
    const out = {};
    for (const k of PUBLIC_KEYS) {
      out[k] = await Settings.get(k, null);
    }
    // Fallbacks
    if (out.deliveryCharge === null || out.deliveryCharge === undefined) {
      out.deliveryCharge = Number(process.env.DELIVERY_CHARGE) || 200;
    }
    if (out.freeShippingThreshold === null || out.freeShippingThreshold === undefined) {
      out.freeShippingThreshold = 0; // 0 = disabled
    }
    res.json(out);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin get all
exports.adminGet = async (req, res) => {
  try {
    const out = {};
    for (const k of PUBLIC_KEYS) out[k] = await Settings.get(k, null);
    if (out.deliveryCharge === null || out.deliveryCharge === undefined) {
      out.deliveryCharge = Number(process.env.DELIVERY_CHARGE) || 200;
    }
    if (out.freeShippingThreshold === null || out.freeShippingThreshold === undefined) out.freeShippingThreshold = 0;
    if (out.saleBanner === null || out.saleBanner === undefined) out.saleBanner = '';
    res.json(out);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin set
exports.adminSet = async (req, res) => {
  try {
    const { deliveryCharge, freeShippingThreshold, saleBanner } = req.body;
    if (deliveryCharge !== undefined) {
      const v = Number(deliveryCharge);
      if (!Number.isFinite(v) || v < 0) return res.status(400).json({ message: 'Invalid delivery charge' });
      await Settings.set('deliveryCharge', v);
    }
    if (freeShippingThreshold !== undefined) {
      const v = Number(freeShippingThreshold);
      if (!Number.isFinite(v) || v < 0) return res.status(400).json({ message: 'Invalid threshold' });
      await Settings.set('freeShippingThreshold', v);
    }
    if (saleBanner !== undefined) {
      await Settings.set('saleBanner', String(saleBanner).slice(0, 300));
    }
    res.json({ message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
