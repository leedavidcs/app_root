import { GetViewerQuery } from "@/client/graphql";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import "next";

declare module "next" {
	export interface NextPageContext {
		apolloClient: ApolloClient<NormalizedCacheObject>;
		apolloState: NormalizedCacheObject;
		user: GetViewerQuery["viewer"];
	}
}
