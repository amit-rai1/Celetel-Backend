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
    scope: ['openid', 'email', 'profile'],
    passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, done) {

    try {


        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

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


        const userProfile = {
            id: linkedInApiResponse.sub,
            name: linkedInApiResponse.name,
            email: linkedInApiResponse.email,
            given_name: linkedInApiResponse.given_name,
            family_name: linkedInApiResponse.family_name,
            picture: linkedInApiResponse.picture,
        };

        req.session.accessToken = accessToken;
        req.session.userProfile = userProfile;

        const linkedInUserId = linkedInApiResponse.sub;


        const existingUser = await clientModel.findOne({ linkedinId: linkedInUserId });

        if (existingUser) {
            existingUser.name = userProfile.name;
            existingUser.email = userProfile.email;

            await existingUser.save();
            req.session.userId = existingUser._id;
            done(null, existingUser);
        } else {

            const newUser = new clientModel({
                linkedinId: linkedInUserId,
                name: userProfile.name,
                email: userProfile.email,

            });



            await newUser.save();
            req.session.userId = newUser._id;
            done(null, newUser);
        }
    } catch (error) {
        console.error('Error creating or saving user:', error);
        done(error);
    }
}));



module.exports = passport.authenticate('linkedin', { scope: ['openid', 'profile', 'email'] });
