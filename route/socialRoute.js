import express from 'express';
// const passport = require("passport
import { passport } from '../middleware/passport';

import { initPassport } from '../middleware/passport';

initPassport();



const router = express.Router();

router.get("/login/success", (req, res) => {
    console.log(req,"req")
	if (req.user) {
		res.status(200).json({
			error: false,
			message: "Successfully Loged In",
			user: req.user,
		});
	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect:"http://localhost:3000",
		failureRedirect: "/login/failed",
	})
);

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("http://localhost:3000/*");
});
export default router;
