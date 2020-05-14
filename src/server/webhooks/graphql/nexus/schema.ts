import { IServerContextWithUser } from "@/server/graphql";
import { rateLimitPlugin, yupValidationPlugin } from "@/server/graphql/nexus/plugins";
import { AuthClient } from "@/server/redis";
import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from "@nexus/schema";
import { RedisStore } from "graphql-rate-limit";
import { nexusPrismaPlugin } from "nexus-prisma";
import path from "path";
import { getClientIp } from "request-ip";
import * as queries from "./queries";
import * as types from "./types";

const dirname: string = process.env.PROJECT_DIRNAME
	? path.join(process.env.PROJECT_DIRNAME, "src/server/webhooks/graphql/nexus")
	: __dirname;

const getPath = (fileName: string): string => path.join(dirname, fileName);

const isGenerateScript: boolean = process.argv.includes("--nexus-exit");

export const schema = makeSchema({
	shouldGenerateArtifacts: isGenerateScript,
	shouldExitAfterGenerateArtifacts: isGenerateScript,
	types: { queries, types },
	outputs: {
		schema: getPath("generated/schema.gen.graphql"),
		typegen: getPath("generated/typegen.gen.ts")
	},
	nonNullDefaults: {
		input: false,
		output: false
	},
	plugins: [
		nexusPrismaPlugin({
			outputs: { typegen: getPath("generated/nexus-prisma-typegen.gen.d.ts") }
		}),
		queryComplexityPlugin(),
		rateLimitPlugin({
			identifyContext: ({ user, req }: IServerContextWithUser): string => {
				const userId: Maybe<string> = user?.id;
				const ip: Maybe<string> = getClientIp(req);

				const identityKey: string = userId ?? ip ?? "";

				return identityKey;
			},
			/**
			 * @description Use the auth redis client, since requests are rate-limited by userIds
			 * @author David Lee
			 * @date February 25, 2020
			 */
			store: new RedisStore(AuthClient)
		}),
		fieldAuthorizePlugin(),
		yupValidationPlugin()
	],
	typegenAutoConfig: {
		sources: [{ source: "@/server/webhooks/graphql/apollo-server", alias: "ctx" }],
		contextType: "ctx.IWebhooksContext"
	}
});
