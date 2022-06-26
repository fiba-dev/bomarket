import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { createPreference } from "lib/mercadopago";
import { getProduct } from "controller/products";
import { crearOrden } from "controller/order";
import { authMiddlewareCors } from "lib/init-middleware";

async function postHandler(
	req: NextApiRequest,
	res: NextApiResponse,
	userBody
) {
	const { productId } = req.query;
	const product = await getProduct(productId);
	if (product == false) {
		return res.status(404).send({ message: "Product not found" });
	}
	const objectProduct = product.object;

	const order = await crearOrden(req.body, userBody.userId, productId);

	const pref = await createPreference(objectProduct, order, req.body.quantity);

	res.send({ url: pref.body.init_point, Order: order.id });
}

const handler = methods({
	post: postHandler,
});
export default authMiddlewareCors(authMiddleware(handler));
