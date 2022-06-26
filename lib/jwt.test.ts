import test from "ava";
import { generate, decode } from "lib/jwt";

test("generateAndDecodeTest", async (t) => {
	const code = { name: "asdasd" };
	const cryptedCode = generate(code);
	const decryptedCode = decode(cryptedCode);
	t.deepEqual(code.name, decryptedCode.name);
});
