import { fieldAuthorizePlugin, makeSchema, queryComplexityPlugin } from "@nexus/schema";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/schema";
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
		nexusSchemaPrisma({
			experimentalCRUD: true,
			outputs: { typegen: getPath("generated/nexus-prisma-typegen.gen.d.ts") },
			paginationStrategy: "prisma"
		}),
		queryComplexityPlugin(),
		fieldAuthorizePlugin()
	]
});
