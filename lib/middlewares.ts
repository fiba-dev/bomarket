import { NextApiRequest, NextApiResponse } from "next";
// import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

const parseBearerToken = (req): string | null => {
	const auth = req.headers ? req.headers.authorization || null : null;
	if (!auth) {
		return null;
	}

	const parts = auth.split(" ");
	// Malformed header.
	if (parts.length < 2) {
		return null;
	}

	const schema = (parts.shift() as string).toLowerCase();
	const token = parts.join(" ");
	if (schema !== "bearer") {
		return null;
	}

	return token;
};

function authMiddleware(callback) {
	return function (req: NextApiRequest, res: NextApiResponse) {
		const token = parseBearerToken(req);

		if (!token) {
			res.status(401).send({ message: "no hay token" });
		}
		const decodedToken = decode(token);
		if (decodedToken) {
			callback(req, res, decodedToken);
		} else {
			res.status(401).send({ message: "no hay token" });
		}
	};
}

export { authMiddleware };
