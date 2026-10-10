const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/returnController');
const { protect } = require('../middleware/auth');

router.post('/', ctrl.create);
router.get('/admin', protect, ctrl.list);
router.put('/admin/:id', protect, ctrl.update);

module.exports = router;
