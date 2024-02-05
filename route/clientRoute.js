// routes/adminRoutes.js

import express from 'express';
import { clientLogin, clientSignup, clientUpdate, contactUs, contactusInfo, getAllClients, getClientById, sendVerificationEmail, verifyOTP } from '../controller/clientController';
import { checkStatus, newPayment } from '../controller/payment';

const router = express.Router();

router.post('/sendmail', sendVerificationEmail);
router.post('/verifyOtp', verifyOTP);
router.post('/signup',clientSignup);

router.post('/login',clientLogin);


router.get('/getAllClients', getAllClients);

router.get('/getClientById/:clientId', getClientById);
router.put('/setupAccount', clientUpdate);

router.get('/test', (req, res) => {
    res.send('Test route is working!');
    console.log(req,"req")
    console.log(res,"res")

  });

  router.post('/payment', newPayment);
router.post('/status/:txnId', checkStatus);

router.post('/conatctUs',contactusInfo)



  



// router.post('/login', loginAdmin);
// router.post('/authLogin', authLogin);


export default router;
