const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

// Public — validate a code at checkout
router.post('/validate', ctrl.validate);

// Admin
router.use(protect);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
