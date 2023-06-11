import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import CryptoJS from "crypto-js";

import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";
import stripeRoute from "./routes/stripe.js";

const app = express();

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log("DB OK");
	})
	.catch((err) => {
		console.log(err);
	});

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, (err) => {
	if (err) return console.log(err);

	console.log(`Server started on port ${process.env.PORT || "5000"}`);
});
