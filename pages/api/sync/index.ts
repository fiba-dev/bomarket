import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOffsetAndLimit } from "lib/request";
import { airtableBase } from "lib/airtable";
import { productIndex } from "lib/algolia";
import { receiveMessageOnPort } from "worker_threads";

export default function (req: NextApiRequest, res: NextApiResponse) {
	// console.log(lista);
	const { offset, limit } = getOffsetAndLimit(req, 100, 10000);

	airtableBase("Products")
		.select({
			pageSize: limit,
		})
		.eachPage(
			async function (records, fetchNextPage) {
				const objects = records.map((r) => {
					return {
						objectID: r.id,
						...r.fields,
					};
				});

				await productIndex.saveObjects(objects);
				console.log("Siguiente PAgina");

				fetchNextPage();
			},
			function done(err) {
				if (err) {
					console.log(err);
					return;
				}
				res.send("TERMINO");
			}
		);
}
