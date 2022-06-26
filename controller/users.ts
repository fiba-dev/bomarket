import { object } from "yup";
import { User } from "models/user";

export async function editUser(body, user: User) {
	const usuario = user.data;

	Object.assign(usuario, body);

	user.push();

	return user;
}
export async function getUserFromId(userId) {
	const user = new User(userId);
	await user.pull();
	return user;
}
export async function getEmailUser(userId) {
	const results = new User(userId);
	await results.pull();
	if (results) {
		const email = results.data.email;
		return email;
	} else return null;
}
