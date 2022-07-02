import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimit } from "lib/request";
import { catalogue } from "lib/algolia";
import { authMiddlewareCors } from "lib/init-middleware";
import { getPhoneUser } from "controller/users";
export default authMiddlewareCors(async function (
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { offset, limit } = getOffsetAndLimit(req);

	const resultado = await catalogue.search(req.query.UserId as string, {
		hitsPerPage: limit,
		length: limit,
		offset: offset,
	});
	const phone = await getPhoneUser(req.query.UserId);
	res.send({
		phone,
		results: resultado.hits,
		pagination: {
			limit,
			offset,
			total: resultado.nbHits,
		},
	});
});
