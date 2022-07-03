import { object } from "yup";
import { User } from "models/user";
import { cloudinary } from "lib/cloudinary";

export async function editUser(body, user: User) {
	const usuario = user.data;
	const imagen = await cloudinary.uploader.upload(body.photo, {
		resource_type: "image",
		discard_original_filename: true,
		width: 1000,
	});
	const data = {
		name: body.name,
		photo: imagen,
		adress: body.adress,
		description: body.description,
		phone: body.phone,
	};

	Object.assign(usuario, data);

	user.push();

	return user;
}
export async function getUserFromId(userId) {
	const user = new User(userId);
	await user.pull();
	let userWhitId = {} as any;
	userWhitId = user;
	userWhitId.data.userId = userId;

	return userWhitId;
}
export async function getEmailUser(userId) {
	const results = new User(userId);
	await results.pull();
	if (results) {
		const email = results.data.email;
		return email;
	} else return null;
}
export async function getPhoneUser(userId) {
	const results = new User(userId);
	await results.pull();
	if (results) {
		const phone = results.data.phone;
		console.log("SOY PHONE", phone);

		return phone;
	} else {
		return null;
	}
}
