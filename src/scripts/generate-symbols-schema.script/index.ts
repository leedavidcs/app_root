import baseAst from "@/scripts/generated/symbols/ast";
import { oneLine } from "common-tags";
import * as providers from "./providers";
import { rql } from "./rest-ql";

interface IConfig {
	shouldGenerateArtifacts?: boolean;
}

const requestArgs = rql.requestArgsObject({
	args: {
		symbols: rql.arg({
			description: oneLine`
				(a.k.a Tickers) Stock symbols for which to fetch data
			`,
			mock: ["GOOGL"],
			nullable: false
		})
	},
	groupBy: {
		symbols: "symbol"
	}
});

export const makeSymbolsClient = (config?: IConfig) => {
	return rql.makeClient({
		config: {
			baseAst,
			output: {
				ast: "symbols/ast.ts",
				graphQL: "symbols/schema.graphql",
				nexus: "symbols/schema.ts"
			},
			shouldGenerateArtifacts: config?.shouldGenerateArtifacts
		},
		requestArgs,
		providers
	});
};
