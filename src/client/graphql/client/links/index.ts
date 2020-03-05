import { ApolloLink } from "apollo-boost";
import { AuthLink } from "./auth.link";
import { ErrorLink } from "./error.link";
import { HttpLink } from "./http.link";

export const link: ApolloLink = ApolloLink.from([AuthLink, ErrorLink, HttpLink]);
