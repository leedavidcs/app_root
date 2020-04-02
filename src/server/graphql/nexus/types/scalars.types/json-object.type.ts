import { scalarType } from "@nexus/schema";
import { JSONObjectResolver } from "graphql-scalars";

export const JSONObject = scalarType({
	name: "JSONObject",
	description: JSONObjectResolver.description,
	serialize: JSONObjectResolver.serialize,
	parseValue: JSONObjectResolver.parseValue,
	parseLiteral: JSONObjectResolver.parseLiteral
});
