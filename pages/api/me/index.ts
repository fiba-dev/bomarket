import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import method from "micro-method-router";
import { editUser, getUserFromId } from "controller/users";
import { authMiddlewareCors } from "lib/init-middleware";

async function getUser(req: NextApiRequest, res: NextApiResponse, token) {
	const user = await getUserFromId(token.userId);

	res.send(user.data);
}
async function setUser(req: NextApiRequest, res: NextApiResponse, token) {
	const user = await getUserFromId(token.userId);

	if (req.body.nombre && req.body.telefono && req.body.direccion) {
		await editUser(req.body, user);
	} else {
		return res.status(400).send({
			message: "FALTAN DATOS",
		});
	}

	res.send(true);
}

const handlerAuth = method({
	get: getUser,
	patch: setUser,
});

export default authMiddlewareCors(authMiddleware(handlerAuth));
