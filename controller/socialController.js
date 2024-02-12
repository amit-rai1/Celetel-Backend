import passport from '../middleware/passport'; // Import Passport or your Passport configuration

const socialController = {
    googleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),

    googleCallback: passport.authenticate('google', {
        successRedirect: 'https://www.celetel.com',
        failureRedirect: 'https://www.celetel.com/login',
    }),

    loginSuccess(req, res) {
        try {
            if (req.user) {
                res.status(200).json({ message: 'User Login', user: req.user });
            } else {
                res.status(400).json({ message: 'Not Authorized' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    logout(req, res) {
        try {
            req.logout();
            res.redirect('https://celetel-testing.onrender.com');
        } catch (error) {
            res.status(500).json({ message: 'Logout Error' });
        }
    },
};

export default socialController;
