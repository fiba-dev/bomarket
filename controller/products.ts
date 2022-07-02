import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { productIndex } from "lib/algolia";
import { Product } from "models/products";

function getOffsetAndLimit(req: NextApiRequest, maxLimit, maxOffset) {
	const queryOffset = parseInt(req.query.offset as string);
	const queryLimit = parseInt(req.query.limit as string);
	const offset = queryOffset < maxOffset ? queryOffset : 0;
	const limit = queryLimit <= maxLimit ? queryLimit : 100;
	return { offset, limit };
}
export async function getProduct(objectId) {
	try {
		return await productIndex.findObject((hit) => hit.objectID == objectId, {});
	} catch (error) {
		return false;
	}
}
export async function setOrUpdateProduct(product, userId) {
	if (product.id) {
		Product.UpdateProduct(product, userId);
	} else {
		Product.createNewProduct(product, userId);
	}
}
