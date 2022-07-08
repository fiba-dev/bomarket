import { NextApiRequest, NextApiResponse } from "next";
import { getOffsetAndLimit } from "lib/request";
import { catalogue } from "lib/algolia";
import { authMiddlewareCors } from "lib/init-middleware";
import {
	getDescriptionUser,
	getPhoneUser,
	getPhotoUser,
} from "controller/users";
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
	const photo = await getPhotoUser(req.query.UserId);
	const description = await getDescriptionUser(req.query.UserId);

	res.send({
		photo: photo.secure_url,
		phone,
		description,
		results: resultado.hits,
		pagination: {
			limit,
			offset,
			total: resultado.nbHits,
		},
	});
});
