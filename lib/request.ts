import type { NextApiRequest, NextApiResponse } from "next";

export function getOffsetAndLimit(
	req: NextApiRequest,
	maxLimit = 100,
	maxOffset = 10000
) {
	const queryOffset = parseInt((req.query.offset as string) || "0");
	const queryLimit = parseInt((req.query.limit as string) || "0");
	let limit = 10;
	if (queryLimit > 0 && queryLimit < maxLimit) {
		limit = queryLimit;
	} else if (queryLimit > maxLimit) {
		limit = maxLimit;
	}
	const offset = queryOffset < maxOffset ? queryOffset : 0;

	return { offset, limit };
}
