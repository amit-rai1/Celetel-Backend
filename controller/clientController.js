import { sendEmail } from "../middleware/sendEmail";
import clientModel from "../model/clientModel";


export const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const otp = generateOTP(); // Implement your OTP generation logic here
        const timestamp = Date.now();
        // Sending verification email
        const emailSent = await sendEmail('amit.rai@celetel.com', email, 'Email Verification OTP', `Your OTP for email verification is: ${otp}`);

        if (!emailSent) {
            throw new Error('Failed to send verification email');
        }
        req.session.email = email;
        req.session.otp = otp;
        req.session.timestamp = timestamp;
        console.log(req.session.email, " req.session.email")
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

        // Retrieve the stored email and OTP from the session
        const storedEmail = req.session.email;
        const storedOTP = req.session.otp;
        console.log(storedEmail, "stored");
        console.log(storedOTP, "storedOTP");

        if (!storedEmail || !storedOTP) {
            throw new Error('Email or OTP not found in session');
        }

        if (String(storedOTP) !== enteredOTP) {
            throw new Error('Invalid OTP');
        }

        // Mark the email as verified or perform further actions as needed
        req.session.isEmailVerified = true;

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




