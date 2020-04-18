import { IServerContext } from "@/server/graphql/context";
import { AuthClient } from "@/server/redis";
import { IMiddlewareGenerator } from "graphql-middleware";
import { RedisStore } from "graphql-rate-limit";
import { getClientIp } from "request-ip";
import { speedLimits } from "./speed-limits";

const identifyContext = ({ user, req }: IServerContext) => {
	const userId: Maybe<string> = user?.id;
	const ip: Maybe<string> = getClientIp(req);

	const identityKey: string = userId || ip || "";

	return identityKey;
};

export const rateLimits: IMiddlewareGenerator<any, IServerContext, any> = speedLimits(
	{
		identifyContext,
		/**
		 * @description Use the auth redis client, since requests are rate-limited by userIds
		 * @author David Lee
		 * @date February 25, 2020
		 */
		store: new RedisStore(AuthClient)
	},
	{
		Query: {},
		Mutation: {}
	}
);
