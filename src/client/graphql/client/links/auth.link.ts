import { getToken } from "@/server/authentication/cookie-utils";
import { ApolloLink } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { IncomingHttpHeaders, IncomingMessage } from "http";

interface IAuthLinkContext {
	headers: IncomingHttpHeaders;
}

export const getAuthLink = (req?: IncomingMessage): ApolloLink => {
	return setContext(
		async (__, { headers }: IAuthLinkContext): Promise<IAuthLinkContext> => {
			const token: Maybe<string> = getToken(req);

			return Promise.resolve({
				headers: {
					...headers,
					Authorization: token ? `Bearer ${token}` : ""
				}
			});
		}
	);
};
