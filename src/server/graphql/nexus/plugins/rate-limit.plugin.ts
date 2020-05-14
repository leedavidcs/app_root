import { RateLimitError } from "@/server/utils";
import { plugin } from "@nexus/schema";
import {
	ArgsValue,
	GetGen,
	MaybePromise,
	printedGenTyping,
	printedGenTypingImport,
	RootValue
} from "@nexus/schema/dist/core";
import { oneLine } from "common-tags";
import { GraphQLResolveInfo } from "graphql";
import { getGraphQLRateLimiter } from "graphql-rate-limit";
import {
	GraphQLRateLimitConfig,
	GraphQLRateLimitDirectiveArgs
} from "graphql-rate-limit/build/main/lib/types";

/* eslint-disable no-console */

const fieldRateLimitResolverImport = printedGenTypingImport({
	module: "@/server/graphql/nexus/plugins/rate-limit.plugin",
	bindings: ["IFieldRateLimitResolver"]
});

const fieldDefTypes = printedGenTyping({
	optional: true,
	name: "rateLimit",
	description: oneLine`
		Rate limit plugin for an individual field. Uses the same directive args as
		\`graphql-rate-limit\`.
	`,
	type: "IFieldRateLimitResolver<TypeName, FieldName>",
	imports: [fieldRateLimitResolverImport]
});

export type IFieldRateLimitResolver<TypeName extends string, FieldName extends string> = (
	root: RootValue<TypeName>,
	args: ArgsValue<TypeName, FieldName>,
	context: GetGen<"context">,
	info: GraphQLResolveInfo
) => MaybePromise<GraphQLRateLimitDirectiveArgs>;

export const rateLimitPlugin = (options: GraphQLRateLimitConfig) => {
	const rateLimiter = getGraphQLRateLimiter(options);

	return plugin({
		name: "CustomNexusRateLimit",
		description: "The rateLimit plugin provides field-level rate limiting for a schema",
		fieldDefTypes,
		onCreateFieldResolver: (config) => {
			const rateLimit = config.fieldConfig.extensions?.nexus?.config.rateLimit;

			/**
			 * @description If the field doesn't have a rateLimit field, don't worry about wrapping
			 *     the resolver
			 */
			if (rateLimit == null) {
				return;
			}

			if (typeof rateLimit !== "function") {
				console.error(
					new Error(
						`The rateLimit property provided to ${config.fieldConfig.name} with type ${
							config.fieldConfig.type
						} should be a function, saw ${typeof rateLimit}`
					)
				);

				return;
			}

			return async (parent, args, context, info, next) => {
				const rateLimitArgs: GraphQLRateLimitDirectiveArgs = rateLimit(
					parent,
					args,
					context,
					info
				);

				const errorMessage: Maybe<string> = await rateLimiter(
					{ parent, args, context, info },
					rateLimitArgs
				);

				if (errorMessage) {
					throw new RateLimitError(errorMessage);
				}

				return next(parent, args, context, info);
			};
		}
	});
};
