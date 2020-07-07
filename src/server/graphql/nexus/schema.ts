import { IServerContextWithUser } from "@/server/graphql/context";
import { AuthClient } from "@/server/redis";
import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from "@nexus/schema";
import { RedisStore } from "graphql-rate-limit";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
import path from "path";
import { getClientIp } from "request-ip";
import * as mutations from "./mutations";
import { rateLimitPlugin, yupValidationPlugin } from "./plugins";
import * as queries from "./queries";
import * as types from "./types";

const dirname: string = process.env.PROJECT_DIRNAME
	? path.join(process.env.PROJECT_DIRNAME, "src/server/graphql/nexus")
	: __dirname;

const getPath = (fileName: string): string => path.join(dirname, fileName);

const isGenerateScript: boolean = process.argv.includes("--nexus-exit");

export const schema = makeSchema({
	shouldGenerateArtifacts: isGenerateScript,
	shouldExitAfterGenerateArtifacts: isGenerateScript,
	types: { ...mutations, ...queries, ...types },
	outputs: {
		schema: getPath("generated/schema.gen.graphql"),
		typegen: getPath("generated/typegen.gen.ts")
	},
	nonNullDefaults: {
		input: false,
		output: false
	},
	plugins: [
		nexusSchemaPrisma({
			experimentalCRUD: true,
			outputs: { typegen: getPath("generated/nexus-prisma-typegen.gen.d.ts") },
			paginationStrategy: "prisma"
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
		sources: [{ source: "@/server/graphql/context", alias: "ctx" }],
		contextType: "ctx.IServerContextWithUser"
	}
});
