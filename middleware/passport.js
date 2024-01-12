// passport.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as OutlookStrategy } from 'passport-outlook';
const linkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const crypto = require('crypto');

import clientModel from '../model/clientModel';

const initPassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    clientModel.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8600/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await clientModel.findOne({ googleId: profile.id });

      if (!user) {
        // If the user doesn't exist, create a new user in the database
        user = new clientModel({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value, // Extract email
        image: profile.photos[0].value
          // Map other relevant fields from the profile
        });
        await user.save();
      }else {
        // If the user exists, update additional details if needed
        user.displayName = profile.displayName;
        user.email = profile.emails[0].value;
        user.image = profile.photos[0].value;
        // Update other fields as needed
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }));
};


//outlook login 



// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_CLIENT_ID,
//   clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//   callbackURL: "http://localhost:8600/auth/linkedin/callback",
//   scope: ['email', 'profile','openid','w_member_social'] // Adjust scopes as needed
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     console.log('Access Token:', accessToken);
//     // Here, process the 'profile' object received from LinkedIn
//     let user = await clientModel.findOne({ linkedinId: profile.id });

//     if (!user) {
//       user = new clientModel({
//         linkedinId: profile.id,
//         displayName: profile.displayName,
//         // Map other relevant fields from the profile
//       });
//       await user.save();
//     } else {
//       user.displayName = profile.displayName;
//       // Update other fields if needed
//       await user.save();
//     }

//     // Return the user object to passport for authentication
//     return done(null, user);
//   } catch (err) {
//     console.error("LinkedIn OAuth error:", err);
//     return done(err, false);
//   }
// }));
// ... (previous code remains unchanged)












export { initPassport, passport };
