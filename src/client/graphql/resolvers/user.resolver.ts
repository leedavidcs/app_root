import { IClientContext } from "@/client/graphql";
import {
	GetUserDocument,
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

	const query = GetUserDocument;
	const data = { user };

	cache.writeQuery({ query, data });

	return user;
};

export const UserMutations = { setUser };
