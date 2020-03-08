import { makeSchema, queryComplexityPlugin } from "nexus";
import { nexusPrismaPlugin } from "nexus-prisma";
import path from "path";
import * as mutations from "./mutations";
import * as queries from "./queries";
import * as types from "./types";

const dirname: string = process.env.PROJECT_DIRNAME
	? path.join(process.env.PROJECT_DIRNAME, "src/server/graphql/nexus")
	: __dirname;

const getPath = (fileName: string): string => {
	return path.join(dirname, fileName);
};

const isGenerateScript: boolean = process.argv.includes("--nexus-exit");

export const nexusSchema = makeSchema({
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
		nexusPrismaPlugin({
			outputs: { typegen: getPath("generated/nexus-prisma-typegen.gen.d.ts") },
			computedInputs: {
				user: ({ ctx }) => ({ connect: { id: ctx.user.id } })
			}
		}),
		queryComplexityPlugin()
	],
	typegenAutoConfig: {
		sources: [{ source: getPath("../context.ts"), alias: "ctx" }],
		contextType: "ctx.IServerContextWithUser"
	}
});
