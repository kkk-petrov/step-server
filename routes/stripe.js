import express from "express";
import Stripe from "stripe";
import dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_KEY);
const router = express.Router();

router.post("/payment", (req, res) => {
	stripe.charges.create(
		{
			source: req.body.tokenId,
			amount: req.body.amount,
			currency: "uah",
		},
		(stripeErr, stripeRes) => {
			if (stripeErr) {
				res.status(500).json(stripeErr);
			} else {
				res.status(200).json(stripeRes);
			}
		}
	);
});

export default router;
