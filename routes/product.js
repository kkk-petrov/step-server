import express from "express";
import { verifyAuth, verifyAdmin } from "./verifyToken.js";
import Product from "../models/Product.js";
const router = express.Router();

// CREATE
router.post("/", verifyAdmin, async (req, res) => {
	const newProduct = new Product(req.body);

	try {
		const savedProduct = await newProduct.save();
		res.status(200).json(savedProduct);
	} catch (err) {
		res.status(500).json(err);
	}
});

// UPDATE
router.put("/:id", verifyAuth, async (req, res) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedProduct);
	} catch (err) {
		res.status(500).json(err);
	}
});

// DELETE
router.delete("/:id", verifyAdmin, async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);
		res.status(200).json({ msg: "Product has been deleted." });
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		res.status(200).json(product);
	} catch (err) {
		res.status(500).json(err);
	}
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
	const qNew = req.query.new;
	const qCategory = req.query.category;
	const qSearch = req.query.search;

	try {
		let products;
		if (qNew) {
			products = await Product.find().sort({ createdAt: -1 }).limit(qNew);
		} else if (qCategory) {
			products = await Product.find({
				categories: {
					$in: [qCategory],
				},
			});
		} else if (qSearch) {
			products = await Product.find({
				$text: { $search: qSearch },
			});
		} else {
			products = await Product.find();
		}

		res.status(200).json(products);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
