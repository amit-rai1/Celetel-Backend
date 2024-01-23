// payment.js (or whatever your router file is named)
var express = require('express');
const { newPayment, checkStatus } = require('../controller/payment');
var router = express.Router();

router.post('/payment', newPayment);
router.post('/status/:txnId', checkStatus);

router.get('/test', (req, res) => {
    res.send('Hello, World!');
  });

module.exports = router;
