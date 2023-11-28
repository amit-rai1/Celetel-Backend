const crypto = require('crypto');

// Generate a secret key using crypto
const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey,"secretKey");

const session = require('express-session');

const sessionMiddleware = session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 } // Set the cookie expiration to 5 minutes (in milliseconds)

});

module.exports = sessionMiddleware;
