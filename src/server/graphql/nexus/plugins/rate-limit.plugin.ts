import { plugin } from "@nexus/schema";
import {
	ArgsValue,
	GetGen,
	printedGenTyping,
	printedGenTypingImport,
	RootValue
} from "@nexus/schema/dist/core";
import { GraphQLResolveInfo } from "graphql";
import path from "path";

const dirname: string = process.env.PROJECT_DIRNAME
	? path.join(process.env.PROJECT_DIRNAME, "src/server/graphql/nexus/plugins")
	: __dirname;

const fieldRateLimitResolverImport = printedGenTypingImport({
	module: path.join(dirname, "rate-limit.plugin"),
	bindings: ["IFieldRateLimitResolver"]
});

const fieldDefTypes = printedGenTyping({
	optional: true,
	name: "rateLimit",
	description: "",
	type: "IFieldRateLimitResolver<TypeName, FieldName>",
	imports: [fieldRateLimitResolverImport]
});

export type IFieldRateLimitResolver<TypeName extends string, FieldName extends string> = (
	root: RootValue<TypeName>,
	args: ArgsValue<TypeName, FieldName>,
	context: GetGen<"context">,
	info: GraphQLResolveInfo
) => string;

export const rateLimitPlugin = () => {
	return plugin({
		name: "CustomNexusRateLimit",
		description: "The rateLimit plugin provides field-level rate limiting for a schema",
		fieldDefTypes
	});
};
