import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { sendCode } from "controller/auth";
import { sendOrderStatusEmail } from "lib/sendgrid";
import { getMerchantOrder } from "lib/mercadopago";
import { id } from "date-fns/locale";
import { Order } from "models/order";
import { User } from "models/user";
import { getOrderFromId } from "controller/order";
import { getEmailUser } from "controller/users";

export default async function changeStatusOrder(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id, topic } = req.query;

	try {
		if (topic == "merchant_order") {
			const results = await getMerchantOrder(id);

			if (results.order_status == "paid") {
				const orderId = results.external_reference;
				const myOrder = await getOrderFromId(orderId);
				const userId = myOrder.data.userId;
				const email = await getEmailUser(userId);
				myOrder.data.status = "closed";
				await myOrder.push();
				await sendOrderStatusEmail(email);
			}
		}
	} catch (error) {
		res.send(error);
	}
	res.send("ok");
}
