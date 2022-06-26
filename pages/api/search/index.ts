import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimit } from "lib/request";
import { productIndex } from "lib/algolia";
import { authMiddlewareCors } from "lib/init-middleware";
export default authMiddlewareCors(async function (
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { offset, limit } = getOffsetAndLimit(req);

	const resultado = await productIndex.search(req.query.q as string, {
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
