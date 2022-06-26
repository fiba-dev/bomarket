import { firestore } from "lib/firestore";
const collection = firestore.collection("orders");

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
	static async createNewProduct(newProductData = {}) {
		const newProductSnap = await collection.add(newProductData);
		const newProduct = new Product(newProductSnap.id);
		newProduct.data = newProductData;
		return newProduct;
	}
}
