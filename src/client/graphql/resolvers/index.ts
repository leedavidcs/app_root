import { Resolvers } from "apollo-boost";
import { ModalMutations } from "./modal.resolver";
import { UserMutations } from "./user.resolver";

export const resolvers: Resolvers = {
	Mutation: {
		...ModalMutations,
		...UserMutations
	}
};
