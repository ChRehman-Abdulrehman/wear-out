const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notifyController');
const { protect } = require('../middleware/auth');

router.post('/', ctrl.create);
router.get('/admin', protect, ctrl.list);

module.exports = router;
