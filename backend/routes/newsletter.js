const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/newsletterController');
const { protect } = require('../middleware/auth');

router.post('/', ctrl.subscribe);
router.get('/admin', protect, ctrl.list);

module.exports = router;
