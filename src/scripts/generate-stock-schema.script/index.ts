import baseAst from "@/scripts/generated/stock-schema/ast";
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

export const makeStockSchema = (config?: IConfig) => {
	return rql.makeClient({
		config: {
			baseAst,
			output: {
				ast: "stock-schema/ast.ts",
				graphQL: "stock-schema/schema.graphql",
				nexus: "stock-schema/schema.ts"
			},
			shouldGenerateArtifacts: config?.shouldGenerateArtifacts
		},
		requestArgs,
		providers
	});
};
