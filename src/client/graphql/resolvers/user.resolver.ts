import { IClientContext, SetUserVariables } from "@/client/graphql/types";

const setUser: LocalResolver<any, IClientContext, SetUserVariables> = (
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
