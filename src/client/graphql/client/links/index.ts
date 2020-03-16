import { ApolloLink } from "apollo-boost";
import { IncomingMessage } from "http";
import { getAuthLink } from "./auth.link";
import { ErrorLink } from "./error.link";
import { HttpLink } from "./http.link";

export const getLink = (req?: IncomingMessage): ApolloLink => {
	return ApolloLink.from([getAuthLink(req), ErrorLink, HttpLink]);
};
