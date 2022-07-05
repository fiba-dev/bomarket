import * as yup from "yup";
import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { featuredProducts } from "controller/products";
import { authMiddlewareCors } from "lib/init-middleware";

export async function getHandler(req: NextApiRequest, res: NextApiResponse) {
	let products = await featuredProducts();
	res.send(products);
}

const handler = methods({
	get: getHandler,
});

export default authMiddlewareCors(handler);
