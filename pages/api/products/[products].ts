import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { getProduct } from "controller/products";
import Cors from "cors";
const cors = Cors({
	methods: ["GET", "POST", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}
function authMiddlewareCors(callback) {
	const data = {};
	return async function (req: NextApiRequest, res: NextApiResponse) {
		const respuesta = await runMiddleware(req, res, cors);
		callback(req, res, data);
	};
}
export default authMiddlewareCors(async function getProducts(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	const productId = req.query.products;
	const resultado = await getProduct(productId);
	if (resultado == false)
		return res.status(404).send({ message: "Product not found" });
	res.send(resultado);
});
