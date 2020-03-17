import { InMemoryCache } from "apollo-boost";
import { User } from "./generated";

export * from "./client";
export * from "./generated";
export * from "./mock-apollo";
export * from "./mocks";
export * from "./resolvers";
export * from "./schemas";

export interface IClientContext {
	cache: InMemoryCache;
}

export interface IClientState {
	modal: boolean;
	user: User | null;
}
