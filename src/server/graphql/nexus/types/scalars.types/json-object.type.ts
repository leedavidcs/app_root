import { JSONObjectResolver } from "graphql-scalars";
import { scalarType } from "nexus";

export const JSONObject = scalarType({
	name: "JSONObject",
	description: JSONObjectResolver.description,
	serialize: JSONObjectResolver.serialize,
	parseValue: JSONObjectResolver.parseValue,
	parseLiteral: JSONObjectResolver.parseLiteral
});
