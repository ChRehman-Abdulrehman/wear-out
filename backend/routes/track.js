const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trackController');

router.post('/track', ctrl.track);

module.exports = router;
