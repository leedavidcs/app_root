import { IServerContext } from "@/server/graphql/context";
import { IMiddlewareGenerator } from "graphql-middleware";
import { not, shield } from "graphql-shield";
import { isAuthenticated } from "./rules";

const isDebug: boolean = process.env.NODE_ENV !== "production";

export const permissions: IMiddlewareGenerator<any, IServerContext, any> = shield(
	{
		Mutation: {
			loginLocalUser: not(isAuthenticated),
			registerLocalUser: not(isAuthenticated),
			refreshAccessToken: isAuthenticated,
			resendVerifyEmail: isAuthenticated,
			createOneStockPortfolio: isAuthenticated,
			updateOneStockPortfolio: isAuthenticated,
			deleteOneStockPortfolio: isAuthenticated
		}
	},
	{
		allowExternalErrors: isDebug,
		debug: isDebug
	}
);
