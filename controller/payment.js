// const crypto = require('crypto');
import crypto from 'crypto';
import axios from 'axios';
// import cryptoRandomString from 'crypto-random-string';
import randomstring from 'randomstring';
import paymentModel from '../model/paymentModel'
require("dotenv").config();

// const newPayment = async (req, res) => {
//   const API_ENDPOINT = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
//   const MERCHANT_ID = 'CELETELONLINE';
//   const MERCHANT_TRANSACTION_ID = 'MT7850590068188104';
//   const MERCHANT_USER_ID = 'MUID123';
//   const AMOUNT = 100;
//   const REDIRECT_URL = 'https://webhook.site/redirect-url';
//   const REDIRECT_MODE = 'REDIRECT';
//   const CALLBACK_URL = 'https://webhook.site/callback-url';
//   const MOBILE_NUMBER = '9999999999';
//   const PAYMENT_INSTRUMENT_TYPE = 'PAY_PAGE';
//   const SALT_KEY = '7a2356b7-36a1-47cb-ac91-bfbddbd32c91';
//   const SALT_INDEX = 1;

//   // Create payload object
//   const payload = {
//     merchantId: MERCHANT_ID,
//     merchantTransactionId: MERCHANT_TRANSACTION_ID,
//     merchantUserId: MERCHANT_USER_ID,
//     amount: AMOUNT,
//     redirectUrl: REDIRECT_URL,
//     redirectMode: REDIRECT_MODE,
//     callbackUrl: CALLBACK_URL,
//     mobileNumber: MOBILE_NUMBER,
//     paymentInstrument: {
//       type: PAYMENT_INSTRUMENT_TYPE
//     }
//   };

//   // Convert payload to Base64
//   const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

//   // Calculate X-VERIFY header
//   const checksumValue = crypto
//     .createHash('sha256')
//     .update(base64Payload + '/pg/v1/pay' + SALT_KEY)
//     .digest('hex') + '###' + SALT_INDEX;

//   // Axios request configuration
//   const axiosConfig = {
//     headers: {
//       'Content-Type': 'application/json',
//       'X-VERIFY': checksumValue
//     }
//   };

//   try {
//     // Make the API request
//     const response = await axios.post(API_ENDPOINT, { request: base64Payload }, axiosConfig);

//     console.log('Response:', response.data);

//     // Send the response back to the client
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error:', error.message);
//     if (error.response) {
//       console.error('Response data:', error.response.data);
//       // Send the error response back to the client
//       res.status(error.response.status).json(error.response.data);
//     } else {
//       // Send a generic error response
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   }
// };


const newPayment = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      amount,
      merchentUserId
    } = req.body;


    const randomString = randomstring.generate({ length: 13, charset: 'alphanumeric' });

    const merchantTransactionId = `MT${randomString}`;

    // Save payment details to MongoDB
    const paymentData = new paymentModel({
      name,
      email,
      phoneNumber,
      amount,
      merchentUserId,
      merchantTransactionId,
    });

    const savedPayment = await paymentData.save();

    // Continue with your existing code to make the API request

    const API_ENDPOINT = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
    const MERCHANT_ID = 'CELETELONLINE';
    const REDIRECT_URL = 'https://webhook.site/redirect-url';
    const REDIRECT_MODE = 'REDIRECT';
    const CALLBACK_URL = 'https://webhook.site/callback-url';
    const MOBILE_NUMBER = '9999999999';
    const PAYMENT_INSTRUMENT_TYPE = 'PAY_PAGE';
    const SALT_KEY = '7a2356b7-36a1-47cb-ac91-bfbddbd32c91';
    const SALT_INDEX = 1;

    // Create payload object
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: savedPayment.merchantTransactionId, // Use the saved merchantTransactionId
      merchantUserId: savedPayment.merchentUserId, // Use the saved merchentUserId
      amount: savedPayment.amount,
      redirectUrl: REDIRECT_URL,
      redirectMode: REDIRECT_MODE,
      callbackUrl: CALLBACK_URL,
      mobileNumber: MOBILE_NUMBER,
      paymentInstrument: {
        type: PAYMENT_INSTRUMENT_TYPE
      }
    };

    // Convert payload to Base64
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Calculate X-VERIFY header
    const checksumValue = crypto
      .createHash('sha256')
      .update(base64Payload + '/pg/v1/pay' + SALT_KEY)
      .digest('hex') + '###' + SALT_INDEX;

    // Axios request configuration
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksumValue
      }
    };

    // Make the API request
    const response = await axios.post(API_ENDPOINT, { request: base64Payload }, axiosConfig);

    console.log('Response:', response.data);

    // Send the response back to the client
    res.json({
      success: true,
      message: 'Payment successful',
      paymentData: savedPayment,  // Include the saved payment data in the response
      responseData: response.data,
    });
  } catch (error) {
    // Handle errors and send appropriate responses
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      // Send the error response back to the client
      res.status(error.response.status).json(error.response.data);
    } else {
      // Send a generic error response
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
};

// Export the function for use in your application







const checkStatus = async (req, res) => {
  try {
    const merchantTransactionId = req.params.txnId; // Access txnId parameter
    const merchantId = process.env.MID;
    const keyIndex = process.env.SALT_KEY_INDEX || 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: 'GET',
      url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`
      }
    };

    const response = await axios.request(options);

    if (response.data.success === true) {
      console.log("PhonePe API Response:", response.data);
      res.status(200).send({ success: true, message: "Payment Success" });
    } else {
      console.log("PhonePe API Response:", response.data);
      res.status(400).send({ success: false, message: "Payment Failure" });
    }
  } catch (err) {
    console.error("PhonePe API Error:", err.response.data);
    res.status(500).send({ msg: err.message });
  }
};


const makeDebitRequest = async () => {
  try {
    const options = {
      method: 'post',
      url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v4/debit',
      headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
      },
      data: {
        // Add debit request payload here if needed
        // Example payload:
        amount: 500,  // Amount in paise (e.g., 500 paise = ₹5)
        // merchantId: process.env.MID,
        referenceId: 'DEBIT123',  // Replace with a unique reference ID
        accountNumber: 'ACCOUNT_NUMBER',
        ifsc: 'IFSC_CODE',
      }
    };

    const response = await axios.request(options);
    console.log("PhonePe Debit API Response:", response.data);

    // Process the debit response as needed

  } catch (error) {
    console.error("PhonePe Debit API Error:", error.response.data);
    // Handle debit API error if needed
  }
};

module.exports = {
  newPayment,
  checkStatus,
};
