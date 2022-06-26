const algoliasearch = require("algoliasearch");

const client = algoliasearch("X0SLA2BKMW", "1277ad5ef7f257467ae77af406c07c82");
export const productIndex = client.initIndex("products");
