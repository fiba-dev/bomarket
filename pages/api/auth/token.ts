import { NextApiRequest, NextApiResponse } from "next";
import { expireCode } from "controller/auth";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";
import { authMiddlewareCors } from "lib/init-middleware";
import * as yup from "yup";

let userData = yup
	.object()
	.shape({
		email: yup.string(),
		code: yup.number(),
	})
	.noUnknown(true)
	.strict();

export default authMiddlewareCors(async function (
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		await userData.validate(req.body);
		const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);

		if (!auth) {
			return res.status(401).send({
				message: "email o code incorrect",
			});
		}
		const expires = auth.isCodeExpired();
		if (expires) {
			return res.status(401).send({
				message: "CODIGO EXPIRADO",
			});
		}

		await expireCode(auth);
		const token = generate({ userId: auth.data.userId });
		res.send({ token: token });
	} catch (error) {
		return error;
	}
});
