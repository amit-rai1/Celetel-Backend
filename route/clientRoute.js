// routes/adminRoutes.js

import express from 'express';
import { clientLogin, clientSignup, clientUpdate, getAllClients, getClientById, sendVerificationEmail, verifyOTP } from '../controller/clientController';

const router = express.Router();

router.post('/sendmail', sendVerificationEmail);
router.post('/verifyOtp', verifyOTP);
router.post('/signup',clientSignup);

router.post('/login',clientLogin);


router.get('/getAllClients', getAllClients);

router.get('/getClientById/:clientId', getClientById);
router.put('/setupAccount', clientUpdate);



// router.post('/login', loginAdmin);
// router.post('/authLogin', authLogin);


export default router;
