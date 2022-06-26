import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { getOrderFromId } from "controller/order";
import { authMiddlewareCors } from "lib/init-middleware";

async function getOrder(req: NextApiRequest, res: NextApiResponse, userBody) {
	const order = await getOrderFromId(req.query.order);
	res.send(order);
}
const handler = methods({
	get: getOrder,
});
export default authMiddlewareCors(authMiddleware(handler));
