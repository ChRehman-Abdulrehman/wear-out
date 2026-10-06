const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { orderLimiter } = require('../middleware/rateLimiter');
const { handleValidation } = require('../middleware/validate');
const { body } = require('express-validator');

router.post(
  '/',
  orderLimiter,
  [
    body('customer.fullName').isString().trim().notEmpty(),
    body('customer.age').isInt({ min: 1, max: 120 }),
    body('customer.city').isString().trim().notEmpty(),
    body('customer.address').isString().trim().notEmpty(),
    body('customer.whatsapp').matches(/^\+?[0-9]{7,15}$/),
    body('customer.email').isEmail(),
    body('customer.gender').isIn(['Male', 'Female', 'Other']),
    body('items').isArray({ min: 1 }),
    body('items.*.product').isString(),
    body('items.*.size').isString(),
    body('items.*.quantity').isInt({ min: 1 }),
  ],
  handleValidation,
  ctrl.createOrder
);

router.get('/', protect, ctrl.getOrders);
router.get('/:id', protect, ctrl.getOrder);

router.put(
  '/:id/status',
  protect,
  [body('status').optional().isIn(['Order Placed', 'Processing', 'On Delivery', 'Completed', 'Returned', 'Cancelled'])],
  handleValidation,
  ctrl.updateOrderStatus
);

module.exports = router;
