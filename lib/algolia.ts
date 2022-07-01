const algoliasearch = require("algoliasearch");

const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY);

export const productIndex = client.initIndex("products");
export const catalogue = client.initIndex("products");
catalogue.setSettings({
	searchableAttributes: ["UserId", "Name"],
});
