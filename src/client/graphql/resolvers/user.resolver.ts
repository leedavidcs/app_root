import { IClientContext } from "@/client/graphql";
import {
	GetViewerDocument,
	GetViewerQuery,
	SetUserMutationVariables
} from "@/client/graphql/generated";

const setUser: LocalResolver<any, IClientContext, SetUserMutationVariables> = async (
	parent,
	args,
	{ cache, client }
) => {
	const viewerResult = await client.query<GetViewerQuery>({
		query: GetViewerDocument,
		fetchPolicy: "no-cache"
	});

	const user = viewerResult.data.viewer ?? null;

	const data = { user };

	cache.writeData({ data });

	return user;
};

export const UserMutations = { setUser };
