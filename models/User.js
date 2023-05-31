import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		username: {
			type: String,
			unique: true,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		image: {
			type: String
		}
	},
	{ timestamps: true }
);

export default mongoose.model("User", UserSchema);
