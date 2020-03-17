import { IClientContext } from "@/client/graphql";
import { SetUserMutationVariables } from "@/client/graphql/generated";

const setUser: LocalResolver<any, IClientContext, SetUserMutationVariables> = (
	parent,
	{ user },
	{ cache }
) => {
	const data = {
		user: user ? { ...user, __typename: "User" } : null
	};

	cache.writeData({ data });

	return user;
};

export const UserMutations = { setUser };
