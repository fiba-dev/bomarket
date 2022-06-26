import mercadopago from "mercadopago";
import { env } from "process";

mercadopago.configure({
	access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
	const res = await mercadopago.merchant_orders.get(id);

	return res.body;
}

export async function createPreference(product, order, quantity) {
	console.log(mercadopago);

	const res = await mercadopago.preferences.create({
		external_reference: order.id,
		items: [
			{
				title: product.Name,

				description: product.Notes,
				picture_url: product.Images[0].url,
				category_id: product.type,
				quantity: quantity,
				currency_id: "ARS",
				unit_price: product["Unit cost"],
			},
		],
		payer: {
			phone: {},
			identification: {},
			address: {},
		},
		payment_methods: {
			excluded_payment_methods: [{}],
			excluded_payment_types: [{}],
		},
		shipments: {
			free_methods: [{}],
			receiver_address: {},
		},
		additional_info: "Esta es informacion adicional",

		back_urls: {
			failure: "https://dwf-m10-one.vercel.app/thanks",
			success: "https://dwf-m10-one.vercel.app/thanks",
			pending: "https://dwf-m10-one.vercel.app/thanks",
		},

		notification_url: "https://dwf-m9.vercel.app/api/ipn/mercadopago",
		binary_mode: false,
		differential_pricing: {},
	});

	return res;
}
