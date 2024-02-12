const express = require('express');
const router = express.Router();
const { sendotpTesting } = require('../controller/otpTesting');
import { rateLimitMiddleware } from '../middleware/rateLimit'


// Define routes
router.post('/sendotpTesting',rateLimitMiddleware, sendotpTesting);

module.exports = router;
