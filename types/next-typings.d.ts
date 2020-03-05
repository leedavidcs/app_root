import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import "next";
import { Router } from "next/dist/client/router";
import { AppContextType } from "next/dist/next-server/lib/utils";

declare module "next" {
	export interface NextPageContext {
		apolloClient: ApolloClient<NormalizedCacheObject>;
		apolloState: NormalizedCacheObject;
	}
}

declare module "next/app" {
	export interface AppContext extends AppContextType<Router> {
		apolloClient: ApolloClient<NormalizedCacheObject>;
		apolloState: NormalizedCacheObject;
	}
}
