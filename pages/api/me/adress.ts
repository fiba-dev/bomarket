import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import * as yup from "yup";
import { editUser, getUserFromId } from "controller/users";
import { User } from "models/user";

let userDatos = yup
	.object()
	.shape({
		direccion: yup.string(),
	})
	.noUnknown(true)
	.strict();
async function setUser(req: NextApiRequest, res: NextApiResponse, token) {
	const user = await getUserFromId(token.userId);

	try {
		await userDatos.validate(req.body);
	} catch (e) {
		return res.status(422).send({ field: "body", message: "error" });
	}
	const userEdited = await editUser(req.body, user);

	res.send(true);
}
const handler = method({
	patch: setUser,
});
export default authMiddleware(handler);
