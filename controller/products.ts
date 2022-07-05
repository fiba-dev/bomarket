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
		await Product.createNewProduct(product, userId);
		return true;
	} catch (error) {
		return error;
	}
}
export async function updateProduct(product, productId, userId) {
	let resultado = await getProduct(productId);
	if (resultado) {
		await Product.UpdateProduct(product, productId, userId);
		return true;
	} else {
		throw "Producto Inexistente";
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
export async function getProductsByCategory(products, category) {
	let obj = [];
	products.forEach((element) => {
		if (element.Category == category) {
			obj.push(element);
		}
	});
	return obj;
}
export async function getProductWhitLessPrice(products: any) {
	products.sort((a, b) => a["Unit cost"] - b["Unit cost"]);
	console.log("SOY PRODUCTSCON MENOS PRECIO", products[0]);

	return products[0];
}

export async function featuredProducts() {
	const products = await Product.obtainProductsFromAirtable();

	if (products) {
		let teclados: any = await getProductsByCategory(products, "Teclados");
		let audifonos: any = await getProductsByCategory(products, "Auriculares");
		let mouse = await getProductsByCategory(products, "Mouse");
		teclados = await getProductWhitLessPrice(teclados);
		audifonos = await getProductWhitLessPrice(audifonos);
		mouse = await getProductWhitLessPrice(mouse);
		return [teclados, audifonos, mouse];
	} else throw "No se encontraron Productos destacados";
}
