// authRoutes.js
const express = require('express');
const passport = require('passport');

const linkedinStrategy =require('../controller/linkedinStrategy')

const router = express.Router();
const app = express()

// Define your LinkedIn authentication route
router.get('/linkedin', (req, res, next) => {
  // console.log('LinkedIn authentication route hit');
  linkedinStrategy(req, res, next); // Call the LinkedIn strategy function
});

// Inside the LinkedIn callback route (/auth/linkedin/callback) in authRoutes.js
router.get('/linkedin/callback',
  (req, res, next) => {
      // console.log('LinkedIn callback route hit');
      passport.authenticate('linkedin', {
          successRedirect: 'http://localhost:3000',
          failureRedirect: '/'
      })(req, res, next);
  }
);

module.exports = router;
