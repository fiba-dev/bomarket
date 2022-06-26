import { firestore } from "lib/firestore";
const collection = firestore.collection("users");
export class User {
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
	static async createNewUser(data) {
		const newUserSnap = await collection.add(data);
		const newUser = new User(newUserSnap.id);
		newUser.data = data;
		return newUser;
	}
	static async getEmailUser(userid) {
		const results = await collection.doc(userid);
		const data = await (await results.get()).data();

		if (results) {
			const email = data.email;
			return email;
		} else return null;
	}
}
