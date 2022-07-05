import { firestore } from "lib/firestore";
const collection = firestore.collection("orders");
import { airtableBase } from "lib/airtable";
import { cloudinary } from "../lib/cloudinary";
import { id } from "date-fns/locale";
import { productIndex } from "lib/algolia";
export class Product {
	ref: FirebaseFirestore.DocumentReference;
	data: any;
	id: any;
	constructor(id) {
		this.id = id;
		this.ref = collection.doc(id);
	}
	async pull() {
		const snap = await this.ref.get();
		this.data = snap.data();
	}
	async push() {
		this.ref.update(this.data);
	}

	static async UpdateProduct(productData, productId, userId) {
		if (productData.images) {
			const imagenURL = await cloudinary.uploader.upload(productData.images, {
				resource_type: "image",
				discard_original_filename: true,
				width: 1000,
			});

			airtableBase("Products").update(
				[
					{
						id: productId,
						fields: {
							Name: productData.name,
							Description: productData.description,
							"Unit cost": productData.price,
							Images: [
								{
									url: imagenURL.secure_url,
								},
							],
							Category: productData.category,
							Stock: productData.stock,
							UserId: userId,
						} as any,
					},
				],
				function (err, records) {
					if (err) {
						console.error(err);
						return err;
					}
					console.log(records[0].getId());

					return records[0].getId();
				}
			);
		}
	}
	static async createNewProduct(newProductData: any, userId: string) {
		if (newProductData.images) {
			const imagenURL = await cloudinary.uploader.upload(
				newProductData.images,
				{
					resource_type: "image",
					discard_original_filename: true,
					width: 1000,
				}
			);

			return airtableBase("Products").create(
				[
					{
						fields: {
							Name: newProductData.name,
							Description: newProductData.description,
							"Unit cost": newProductData.price,
							Images: [
								{
									url: imagenURL.secure_url,
								},
							],
							Category: newProductData.category,
							Stock: newProductData.stock,
							UserId: userId,
						} as any,
					},
				],
				function (err, records) {
					if (err) {
						console.error(err);
						return err;
					}
					console.log(records[0].getId());
					return records[0].getId();
				}
			);
		}
	}
	static async deleteProduct(productId: string) {
		try {
			console.log("MODEL");

			await airtableBase("Products").destroy(
				[productId],
				function (err, deletedRecords) {
					if (err) {
						console.error(err);
						return;
					}
					console.log("entre a borrar");
					console.log("Deleted", deletedRecords.length, "records");
					return true;
				}
			);
			await productIndex.deleteObject(productId);
			return true;
		} catch (error) {
			return error;
		}
	}

	static async obtainProductsFromAirtable() {
		let objects = [];
		await airtableBase("Products")
			.select({ maxRecords: 50 })
			.all()
			.then((records: any) => {
				records.forEach((element) => {
					element.fields.objectId = element.id;
					objects.push(element.fields);
				});
			})
			.catch((err) => {
				// Handle error.
			});

		return objects;
	}
}
