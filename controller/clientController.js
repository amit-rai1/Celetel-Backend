import { sendEmail } from "../middleware/sendEmail";
import clientModel from "../model/clientModel";
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


// export const sendVerificationEmail = async (req, res) => {
//     try {
//         const { email } = req.body;

//         const otp = generateOTP(); // Implement your OTP generation logic here
//         const timestamp = Date.now();
//         // Sending verification email
//         const emailSent = await sendEmail('amit.rai@celetel.com', email, 'Email Verification OTP', `Your OTP for email verification is: ${otp}`);

//         if (!emailSent) {
//             throw new Error('Failed to send verification email');
//         }
//         req.session.email = email;
//         req.session.otp = otp;
//         req.session.timestamp = timestamp;
//         console.log(req.session.email, " req.session.email")
//         res.status(200).json({ success: true, msg: 'Verification email sent successfully.' });
//     } catch (error) {
//         res.status(400).json({ success: false, msg: error.message });
//     }
// };

export const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = generateOTP(); // Implement your OTP generation logic here

        // Save OTP and email in the database
        const client = new clientModel({
            email: email,
            otp: {
                code: otp
            }
        });

        await client.save();

        // Sending verification email
        const emailSent = await sendEmail('amit.rai@celetel.com', email, 'Email Verification OTP', `Your OTP for email verification is: ${otp}`);

        if (!emailSent) {
            throw new Error('Failed to send verification email');
        }

        res.status(200).json({ success: true, msg: 'Verification email sent successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};

// Mock function for generating OTP (replace with your OTP generation logic)
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

export const verifyOTP = async (req, res) => {
    try {
        const { enteredOTP } = req.body;
        
        console.log(enteredOTP, "entered");
        
        // Find the user in the database based on the entered OTP
        const user = await clientModel.findOne({ 'otp.code': enteredOTP });

        if (!user) {
            throw new Error('Invalid OTP');
        }

        // If the OTP is found, mark it as verified in the database
        user.otp.isVerified = true;
        await user.save();

        res.status(200).json({ success: true, msg: 'Email verification successful' });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};





// export const clientSignup = async (req, res) => {
//     console.log("enter");
//     try {
//         const { fullName, email, role } = req.body;

//         console.log(req.body, "req.body");


//         const existingClient = await clientModel.findOne({ email });

//         if (existingClient) {
//             throw new Error('client with this email already exists');
//         }

//         const clientData = new clientModel({ fullName, email, role });
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
    try {
        const { fullName, email, role } = req.body;

        // Check if the client already exists with the given email
        const existingClient = await clientModel.findOne({ email });

        if (existingClient) {
            return res.status(400).json({
                success: false,
                msg: 'Client with this email already exists'
            });
        }

        // Create a new client instance and save it to the database
        const newClient = new clientModel({ fullName, email, role });
        const savedClient = await newClient.save();

        res.status(200).json({
            success: true,
            msg: 'Client registered successfully',
            result: savedClient._doc
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
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