import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { productIndex } from "lib/algolia";
import { Product } from "models/products";
import { getPhoneUser } from "./users";
import ProductId from "pages/api/products/[productId]";

function getOffsetAndLimit(req: NextApiRequest, maxLimit, maxOffset) {
	const queryOffset = parseInt(req.query.offset as string);
	const queryLimit = parseInt(req.query.limit as string);
	const offset = queryOffset < maxOffset ? queryOffset : 0;
	const limit = queryLimit <= maxLimit ? queryLimit : 100;
	return { offset, limit };
}
export async function getProduct(objectId) {
	try {
		const product: any = await productIndex.findObject(
			(hit) => hit.objectID == objectId,
			{}
		);
		console.log("SOY PRODUCT", product.object.UserId);
		const phone = await getPhoneUser(product.object.UserId);
		product.object.phone = phone;

		return product;
	} catch (error) {
		return false;
	}
}
export async function setProduct(product, userId) {
	try {
		return await Product.createNewProduct(product, userId);
	} catch (error) {
		return error;
	}
}
export async function updateProduct(product, productId, userId) {
	let resultado = await getProduct(productId);
	if (resultado) {
		return await Product.UpdateProduct(product, productId, userId);
	} else {
		throw new Error("NO HAY ID DE OBJETO");
	}
}

export async function deleteProduct(productId) {
	return await Product.deleteProduct(productId);
}

export async function getAllProducts() {
	const products: any = await productIndex.search("", {
		hitsPerPage: 1000,
	});
	return products;
}
