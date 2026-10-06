const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../services/payment.service');

router.post('/create-checkout', async (req, res) => {
  try {
    const { orderId, successUrl, cancelUrl } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID required' });

    const result = await createCheckoutSession(orderId, successUrl, cancelUrl);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;