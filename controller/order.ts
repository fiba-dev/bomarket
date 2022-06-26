import { Order } from "models/order";
export async function getOrderFromId(id) {
	const user = new Order(id);
	await user.pull();
	return user;
}
export async function crearOrden(data, userId, productId) {
	const orden = await Order.createNewOrder({
		aditionalInfo: data,
		productId,

		userId: userId,
		status: "pending",
	});
	return orden;
}
