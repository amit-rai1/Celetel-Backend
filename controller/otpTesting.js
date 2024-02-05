const axios = require('axios');
require("dotenv").config();

const otpTesting = require('../model/otpTesting');

export const sendotpTesting = async (req, res) => {
    try {
      const { recipient } = req.body;

      console.log(req.body,"req.body11")

  
      // Validate required fields
      if (!recipient) {
        throw new Error('Invalid request body');
      }
  
      // Create a new instance of your Mongoose model
      const one2OneData = new otpTesting({
        // credentials: {
        //     password: process.env.CELETel_API_PASSWORD,
        //   user: process.env.CELETel_API_USERNAME,
        // },
        // options: {
        //     dltPrincipalEntityId: process.env.CELETel_DLT_PRINCIPAL_ENTITY_ID,
        // },
        // from: process.env.CELETel_API_FROM,
        recipient,
        shortMessages: [
            {
              message: process.env.CELETel_OTP_MESSAGE,
              corelationId: process.env.CELETel_CORRELATION_ID,
              dltContentId: process.env.CELETel_DLT_CONTENT_ID,
            },
          ],
      });
  
      // Save the data to the database (or perform any other necessary logic)
      await one2OneData.save();
  
      // Make a request to the external OTP SMS API
      await sendOtpSms(recipient, one2OneData.shortMessages);
  
      // Respond with a success message
      res.status(200).json({ success: true, message: 'API request processed successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
  // Function to send OTP SMS using the external API
  async function sendOtpSms(recipient,shortMessages) {
    console.log(recipient,"recipientfunn")
    try {
      // Read values from environment variables
  
      // Modify the API endpoint and request payload based on the actual requirements of the external API
      const apiUrl = 'https://api.celetel.com/api/v1/one2One';
  
      const apiPayload = {
        credentials: {
          password: process.env.CELETel_API_PASSWORD,
          user: process.env.CELETel_API_USERNAME,
        },
        options: {
          dltPrincipalEntityId: process.env.CELETel_DLT_PRINCIPAL_ENTITY_ID,
        },
        from: process.env.CELETel_API_FROM,
        shortMessages: [
          {
            message: process.env.CELETel_OTP_MESSAGE,
            corelationId: process.env.CELETel_CORRELATION_ID,
            dltContentId: process.env.CELETel_DLT_CONTENT_ID,
            recipient: recipient
          },
        ],
      };
  
      // Make a POST request to the external API
      console.log('apiPayload:', apiPayload);
      const response = await axios.post(apiUrl, apiPayload);

      console.log('API Response:', response.data);
    
      if (response.status !== 200) {
        console.error('Failed to send OTP SMS. API Error:', response.status, response.statusText);
        if (response.data && response.data.message) {
          console.error('API Error Message:', response.data.message);
        }
        throw new Error('Failed to send OTP SMS');
      }
    } catch (error) {
      console.error('Error sending OTP SMS:', error.message);
    
      // Log the complete error details
      console.error('Complete Error Object:', error);
    
      throw new Error('Failed to send OTP SMS');
    }
  };
