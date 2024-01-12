// linkedinStrategy.js
const OAuth2Strategy = require('passport-oauth2').Strategy;
import passport from 'passport';
import clientModel from '../model/clientModel';
const https = require('https');

require('dotenv').config();

passport.use('linkedin', new OAuth2Strategy({
    authorizationURL: 'https://www.linkedin.com/uas/oauth2/authorization',
    tokenURL: 'https://www.linkedin.com/uas/oauth2/accessToken',
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: 'http://localhost:8600/auth/linkedin/callback',
    scope: ['openid', 'email','profile'],
    passReqToCallback: true
}, async function(req, accessToken, refreshToken, profile, done) {

    // console.log('authenticated');
    // console.log(accessToken);
    // console.log(profile,"profile")
    try {


        // Ensure that profile.emails exists and has at least one element
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

        // Access and process user profile data
      
        // Use access token to fetch additional user data (optional)
        // Call LinkedIn API using the access token and retrieve desired information

        const linkedInApiUrl = 'https://api.linkedin.com/v2/userinfo';

        const linkedInApiResponse = await new Promise((resolve, reject) => {
            https.get(linkedInApiUrl, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }, function (myres) {
                let linkedinJsonResult = '';

                myres.on('data', function (chunk) {
                    linkedinJsonResult += chunk;
                });

                myres.on('end', function () {
                    resolve(JSON.parse(linkedinJsonResult));
                });

                myres.on('error', function (error) {
                    reject(error);
                });
            });
        });

        // console.log('LinkedIn API Response:', linkedInApiResponse);

        // Access and process user profile data
        const userProfile = {
            id: linkedInApiResponse.sub,
            name: linkedInApiResponse.name,
            email: linkedInApiResponse.email,
            // Extract other desired profile fields from 'linkedinApiResponse' object
            given_name: linkedInApiResponse.given_name,
            family_name: linkedInApiResponse.family_name,
            picture: linkedInApiResponse.picture,
        };
        // console.log(userProfile, "userProfile");

        // Use access token to fetch additional user data from LinkedIn API
        req.session.accessToken = accessToken; // Store access token in session
        req.session.userProfile = userProfile; // Store user profile data in session

        const linkedInUserId = linkedInApiResponse.sub;


        const existingUser = await clientModel.findOne({ linkedinId: linkedInUserId});

         if (existingUser) {
        // Update user profile if the user already exists
        existingUser.name = userProfile.name;
        existingUser.email = userProfile.email;

        await existingUser.save();
        req.session.userId = existingUser._id; // Set the user ID in the session
        done(null, existingUser);
    } else {
        // Create a new user if not exists
        const newUser = new clientModel({
            linkedinId: linkedInUserId,
            name: userProfile.name,
            email: userProfile.email,
            // Add other fields as needed
        });

        // console.log(newUser, "newUser");

        await newUser.save();
        req.session.userId = newUser._id; // Set the user ID in the session
        done(null, newUser);
    }
} catch (error) {
    console.error('Error creating or saving user:', error);
    done(error);
}
}));



module.exports = passport.authenticate('linkedin', { scope: ['openid', 'profile','email'] });
