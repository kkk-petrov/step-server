import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, process.env.JWT_SEC, (err, user) => {
			if (err) return res.status(403).json({ msg: "Token is not valid" });
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json({ msg: "You are not authenticated" });
	}
};

const verifyAuth = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			return res
				.status(403)
				.json({ msg: "you are not allowed to do that!" });
		}
	});
};

const verifyAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			return res
				.status(403)
				.json({ msg: "you are not allowed to do that!" });
		}
	});
};

export { verifyAuth, verifyAdmin, verifyToken };
