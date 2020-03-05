import { InMemoryCache } from "apollo-boost";
import { GetUser_user as User } from "./generated";

export interface IClientContext {
	cache: InMemoryCache;
}

export interface IClientState {
	modal: boolean;
	user: User | null;
}
