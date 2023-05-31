import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		name: req.body.name,
		email: req.body.email,
		passwordHash: CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString(),
	});

	try {
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(401).json({ msg: "Wrong credentials!" });
		}

		const hashedPassword = CryptoJS.AES.decrypt(
			user.passwordHash,
			process.env.PASS_SEC
		);
		const password = hashedPassword.toString(CryptoJS.enc.Utf8);

		if (password !== req.body.password) {
			return res.status(401).json({ msg: "Wrong credentials!" });
		}

		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_SEC,
			{ expiresIn: "3d" }
		);

		const { passwordHash, ...other } = user._doc;

		res.status(200).json({ other, accessToken });
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
