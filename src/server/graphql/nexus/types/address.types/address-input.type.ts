import { inputObjectType } from "@nexus/schema";

export const AddressInput = inputObjectType({
	name: "AddressInput",
	definition: (t) => {
		t.string("line1", { required: true });
		t.string("city");
		t.string("country");
		t.string("zipcode");
		t.string("state");
	}
});
