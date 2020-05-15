import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { User } from "./generated";

export * from "./client";
export * from "./generated";
export * from "./mock-apollo";
export * from "./mocks";
export * from "./resolvers";
export * from "./schemas";
export * from "./state";

export interface IClientContext {
	cache: InMemoryCache;
	client: ApolloClient<NormalizedCacheObject>;
}

export interface IClientState {
	modal: boolean;
	user: User | null;
}
