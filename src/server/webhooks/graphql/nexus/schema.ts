import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from "@nexus/schema";
import { nexusPrismaPlugin } from "nexus-prisma";
import path from "path";
import * as queries from "./queries";
import * as types from "./types";

const dirname: string = process.env.PROJECT_DIRNAME
	? path.join(process.env.PROJECT_DIRNAME, "src/server/webhooks/graphql/nexus")
	: __dirname;

const getPath = (fileName: string): string => path.join(dirname, fileName);

const isGenerateScript: boolean = process.argv.includes("--nexus-exit");

export const schema = makeSchema({
	shouldGenerateArtifacts: isGenerateScript,
	types: { ...queries, ...types },
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
		fieldAuthorizePlugin()
	]
});
