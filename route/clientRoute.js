// routes/adminRoutes.js

import express from 'express';
import { clientSignup, sendVerificationEmail, verifyOTP } from '../controller/clientController';

const router = express.Router();

router.post('/sendmail', sendVerificationEmail);
router.post('/verifyOtp', verifyOTP);
router.post('/signup',clientSignup);


// router.post('/login', loginAdmin);
// router.post('/authLogin', authLogin);


export default router;
