const express = require('express');
const router = express.Router();
const { sendotpTesting } = require('../controller/otpTesting');

// Define routes
router.post('/sendotpTesting', sendotpTesting);

module.exports = router;
