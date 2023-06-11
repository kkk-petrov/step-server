import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);
const router = express.Router();

// router.post("/payment", (req, res) => {
// 	stripe.charges.create(
// 		{
// 			source: req.body.tokenId,
// 			amount: req.body.amount,
// 			currency: "uah",
// 		},
// 		(stripeErr, stripeRes) => {
// 			if (stripeErr) {
// 				res.status(500).json(stripeErr);
// 			} else {
// 				res.status(200).json(stripeRes);
// 			}
// 		}
// 	);
// });

router.post("/payment", async (req, res) => {
	const line_items = req.body.products.map((product) => {
		return {
			price_data: {
				currency: "uah",
				product_data: {
					name: product.title,
					images: [product.img],
					description: `Size - ${product.size}`,
					metadata: {
						id: product._id,
					},
				},
				unit_amount: product.price * 100,
			},
			quantity: product.quantity,
		};
	});

	const session = await stripe.checkout.sessions.create({
		line_items,
		mode: "payment",
		success_url: `http://localhost:3000/success`,
		cancel_url: `http://localhost:3000/cart`,
	});

	res.send({ url: session.url });
});

export default router;
