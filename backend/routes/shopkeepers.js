const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/shopkeeperController');
const { shopkeeperProtect } = require('../middleware/shopkeeperAuth');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

// Public
router.post(
  '/signup',
  [
    body('shopName').isString().trim().notEmpty(),
    body('ownerName').isString().trim().notEmpty(),
    body('phone').isString().trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  handleValidation,
  ctrl.signup
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail(), body('password').isString().notEmpty()],
  handleValidation,
  ctrl.login
);

// Shopkeeper protected
router.get('/me', shopkeeperProtect, ctrl.getProfile);

module.exports = router;
