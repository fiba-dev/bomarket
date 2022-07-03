import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { createPreference } from "lib/mercadopago";
import { getProduct, setOrUpdateProduct } from "controller/products";
import { crearOrden } from "controller/order";
import { authMiddlewareCors } from "lib/init-middleware";
import * as yup from "yup";
let product = yup
	.object()
	.shape({
		id: yup.string(),
		name: yup.string(),
		description: yup.string(),
		price: yup.number(),
		images: yup.string(),
		category: yup.string(),
		stock: yup.number(),
	})
	.noUnknown(true)
	.strict();
async function postHandler(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	try {
		await product.validate(req.body);
		await setOrUpdateProduct(req.body, userBody.userId);
	} catch (error) {
		res.status(404).send(error);
	}

	// const { productId } = req.query;
	// const product = await getProduct(productId);
	// if (product == false) {
	// 	return res.status(404).send({ message: "Product not found" });
	// }
	// const objectProduct = product.object;

	// const order = await crearOrden(req.body, userBody.userId, productId);

	// const pref = await createPreference(objectProduct, order, req.body.quantity);

	res.send(true);
}

const handler = methods({
	post: postHandler,
});
export default authMiddlewareCors(authMiddleware(handler));
