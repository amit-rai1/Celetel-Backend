const express = require('express');
import { contactusInfo } from '../controller/clientController';
const router = express.Router();

// Import the contactUs controller

// Define the route
router.post('/api/contactUs', contactusInfo);

// Other routes...

// Export the router
module.exports = router;
