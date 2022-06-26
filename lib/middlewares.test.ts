import test from "ava";
import { authMiddleware } from "lib/middlewares";
import { generate } from "lib/jwt";

test("authMiddlewareTest", async (t) => {
	const code = { name: "asdasd" };
	const cryptedCode = generate(code);
	let token = {
		headers: {
			"content-type": "application/json",
			authorization: "bearer " + cryptedCode,
		},
	};

	function authTest(req, res, clave) {
		t.deepEqual(code.name, clave.name);
	}

	const resultado = authMiddleware(authTest);

	resultado(token as any, 123 as any);
});
