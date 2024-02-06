import { sendEmail } from "../middleware/sendEmail";
import clientModel from "../model/clientModel";
import otpVerification from "../model/otpVerification";
import contactUs from "../model/contactUs";
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config")


export const sendVerificationEmail = async (req, res) => {
    try {
      const { email } = req.body;
    
      const otp = generateOTP(); // Generate OTP
      const expiryTime = new Date(Date.now() + 5 * 60000); // Set OTP expiry time (5 minutes)
    
    //   Save OTP and email in the database
      const client = new otpVerification({
        // email: email,
        otp: {
          code: otp,
          expiry: expiryTime,
        },
      });
    
      await client.save();
    
      // Send OTP verification email
      const emailSent = await sendEmail('amit.rai@celetel.com', email, 'Email Verification OTP', `Your OTP for email verification is: ${otp}`);
    
      if (!emailSent) {
        throw new Error('Failed to send verification email');
      }
    
      res.status(200).json({ success: true, msg: 'Verification email sent successfully.' });
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
  };
  
  
  function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  



  export const verifyOTP = async (req, res) => {
    try {
      const { enteredOTP } = req.body;
  
      // Find the user in the database based on the entered OTP
      const user = await otpVerification.findOne({ 'otp.code': enteredOTP });

    //   console.log("user",user.otp.expiry);


    //   if (!user?.otp ) {
    //     throw new Error('otp not found pls verify your mail first');
    //   }
  
    if (!user) {
        throw new Error('Invalid OTP');
      }
  
      if (user.isVerified) {
        throw new Error('Email is already verified');
      }
  
      if (user.otp && user.otp.code !== enteredOTP) {
        throw new Error('Invalid OTP');
      }
  
      if (user.otp && user.otp.expiry < new Date()) {
        throw new Error('OTP has expired');
      }

    //   if (user.otp.code !== enteredOTP) {
    //     throw new Error('Invalid OTP');
    //   }
     user.isVerified=true
   
      await user.save();
  
      res.status(200).json({ success: true, msg: 'Email verification successful' });
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message });
    }
  };
  




// export const clientSignup = async (req, res) => {
//     console.log("enter");
//     try {
//         const { fullName, email,country,phone, role } = req.body;

//         // console.log(req.body, "req.body");


//         const existingClient = await clientModel.findOne({ email });

//         if (existingClient) {
//             throw new Error('client with this email already exists');
//         }

//         const clientData = new clientModel({ fullName, email,country,phone, role });
//         const result = await clientData.save(); // Corrected line

        

//         res.send({
//             status: 200,
//             success: true,
//             msg: 'Client registered successfully',
//             result: result._doc
//         });
//     } catch (error) {
//         res.send({ status: 400, success: false, msg: error.message });
//     }
// };

export const clientSignup = async (req, res) => {
    console.log("enter");
    try {
        const { fullName, email, country, phone, role } = req.body;

        // Check if the client already exists
        const existingClient = await clientModel.findOne({ email });
        if (existingClient) {
            throw new Error('Client with this email already exists');
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        const expiryTime = new Date(Date.now() + 5 * 60000); // Set OTP expiry time (5 minutes)

        // Save OTP and email in the database
        const client = new otpVerification({
            email: email,
            otp: {
                code: otp,
                expiry: expiryTime,
            },
        });

        await client.save();

        // Send OTP verification email
        const emailSent = await sendEmail('amit.rai@celetel.com', email, 'Email Verification OTP', `Your OTP for email verification is: ${otp}`);

        if (!emailSent) {
            throw new Error('Failed to send verification email');
        }

        // Create a new client
        const clientData = new clientModel({ fullName, email, country, phone, role });
        const result = await clientData.save();

        // Send response
        res.status(200).json({
            status: 200,
            success: true,
            msg: 'Client registered successfully',
            result: result._doc
        });
    } catch (error) {
        res.status(400).json({ status: 400, success: false, msg: error.message });
    }
};


export const getAllClients = async (req, res) => {
    try {
        // Fetch all clients from the database
        const clients = await clientModel.find();

        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getClientById = async (req, res) => {
    try {
        const { clientId } = req.params;

        // Find client by ID
        const foundClient = await clientModel.findById(clientId);

        if (!foundClient) {
            return res.status(404).json({
                success: false,
                msg: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            result: foundClient._doc
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};


export const clientUpdate = async (req, res) => {
    try {
        const { clientId, email, password, confirmPassword } = req.body;
         console.log(req.body,"req.body123456");
        // Find the client by ID
        let updateFields = {};

        if (password && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                msg: 'Password and confirm password do not match'
            });
        }

        // If password is provided, update it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }

        // Update the email if provided
        if (email) {
            updateFields.email = email;
        }

        const updatedClient = await clientModel.findByIdAndUpdate(
            clientId,
            updateFields,
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({
                success: false,
                msg: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Client account updated successfully',
            result: updatedClient._doc
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};



export const clientLogin = async (req, res) => {


    try {
        const { email, password } = req.body;

        console.log(req.body,"reqqqqqq")

        // Find the user by email
        const user = await clientModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials' });
        }

        // If the credentials are valid, generate a JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, 'yourSecretKey', { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            msg: 'Login successful',
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }

};


//CONTACTUS

export const contactusInfo = async (req, res) => {
    try {
        const { name, email, service, budget, message } = req.body;

        const existingClient = await contactUs.findOne({ email });

        const result = await contactUs.create({ name, email, service, budget, message });

        const adminEmail = 'amit.rai@celetel.com'; 
        const emailSent = await sendEmail(
            adminEmail,
            adminEmail, 
            'New Contact Form Submission',
            `A new contact form has been submitted:\n\nUser Information:\nName: ${name}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\nMessage: ${message}`
        );

        if (!emailSent) {
            throw new Error('Failed to send notification email');
        }

        res.status(200).json({
            success: true,
            msg: 'Thank you for getting in touch! We will connect with you shortly.',
            result
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};