const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.get('/', ctrl.publicSettings);
router.get('/admin', protect, ctrl.adminGet);
router.put('/admin', protect, ctrl.adminSet);

module.exports = router;
