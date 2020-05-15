import { Resolvers } from "@apollo/client";
import { ModalMutations } from "./modal.resolver";
import { ToastMutations } from "./toast.resolver";
import { UserMutations } from "./user.resolver";

export const resolvers: Resolvers = {
	Mutation: {
		...ModalMutations,
		...ToastMutations,
		...UserMutations
	}
};
