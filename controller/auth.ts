import { User } from "models/user";
import { Auth } from "models/auth";
import { sendCodeEmail } from "lib/sendgrid";
import gen from "random-seed";
import { addSeconds, subSeconds } from "date-fns";
import rn from "random-number";

var gen = rn.generator({
	min: 0,
	max: 100000,
	integer: true,
});

async function sendCode(email) {
	try {
		const auth = await findOrCreateAuth(email);
		const code = gen();
		console.log("soy code", code);

		const now = new Date();
		const twentyMinutes = addSeconds(now, 1200);
		auth.data.code = code;
		auth.data.expires = twentyMinutes;
		await auth.push();
		await sendCodeEmail(email, code, twentyMinutes);
		console.log("EMAIL ENVIADO A: " + email + " CON CODIGO:" + code);
		console.log("soy code2", code);

		return true;
	} catch (error) {
		return error;
	}
}
async function expireCode(auth) {
	console.log("soy datadeauth", auth.data.expires.toDate());

	const twentyMinutes = subSeconds(auth.data.expires.toDate(), 1200);
	auth.data.expires = twentyMinutes;
	await auth.push();
}

async function findOrCreateAuth(email: string) {
	const cleanEmail = email.trim().toLowerCase();
	const auth = await Auth.findByEmail(cleanEmail);
	if (auth) {
		console.log("AUTH ENCONTRADO");

		return auth;
	} else {
		console.log("AUTH NO ENCONTRADO, CREANDO UNO NUEVO");

		const newUser = await User.createNewUser({
			email: cleanEmail,
		});
		const newAuth = await Auth.createNewAuth({
			email: cleanEmail,
			userId: newUser.id,
			code: "",
			expires: new Date(),
		});
		return newAuth;
	}
}
export { expireCode, sendCode, findOrCreateAuth };
