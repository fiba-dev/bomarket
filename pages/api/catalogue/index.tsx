import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimit } from "lib/request";
import { catalogue } from "lib/algolia";
import { authMiddlewareCors } from "lib/init-middleware";
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

	res.send({
		results: resultado.hits,
		pagination: {
			limit,
			offset,
			total: resultado.nbHits,
		},
	});
});
