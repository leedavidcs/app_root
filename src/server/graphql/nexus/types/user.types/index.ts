import { objectType } from "@nexus/schema";

export const User = objectType({
	name: "User",
	description: "Basic user of the application",
	definition: (t) => {
		t.model.id();
		t.field("email", {
			type: "EmailAddress",
			nullable: false,
			description: "The user's email"
		});
		t.model.emailVerified();
		t.model.username();
		t.model.createdAt();
		t.model.updatedAt();
	}
});
