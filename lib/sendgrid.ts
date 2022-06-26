import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
async function sendCodeEmail(email: string, code: number, expires) {
	const msg = {
		to: email, // Change to your recipient
		from: "fibarrola06@gmail.com", // Change to your verified sender
		subject: "Sending with SendGrid is Fun",
		text: "and easy to do anywhere, even with Node.js",
		html:
			"<strong>CODIGO:" +
			code +
			" al email" +
			email +
			" y expira " +
			expires +
			" </strong>",
	};
	await sgMail
		.send(msg)
		.then((res) => {
			console.log("Email sent");
			return true;
		})
		.catch((error) => {
			console.error(error);
			return false;
		});
}

async function sendOrderStatusEmail(email) {
	const msg = {
		to: email, // Change to your recipient
		from: "fibarrola06@gmail.com", // Change to your verified sender
		subject: "PAGO REALIZADO",
		text: "PAGO REALIZADO",
		html: "<strong>SU PAGO FUE REALIZADO CON EXITO </strong>",
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});
	return true;
}

export { sendCodeEmail, sendOrderStatusEmail };
