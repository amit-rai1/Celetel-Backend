/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');

// const authProvider = require('../auth/AuthProvider');
const authProvider = require('../middleware/AuthProvider')
const { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require('../middleware/authConfig');

const router = express.Router();
console.log('Redirect URI:', REDIRECT_URI);

router.get('/signin', authProvider.login({
    scopes: [],
    redirectUri: REDIRECT_URI,
    successRedirect: '/'
}));

router.get('/acquireToken', authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/users/profile'
}));

router.post('/redirect', authProvider.handleRedirect());

router.get('/signout', authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI
}));

module.exports = router;
