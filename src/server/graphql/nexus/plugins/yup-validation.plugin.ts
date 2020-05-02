import {
	ArgsValue,
	GetGen,
	MaybePromise,
	plugin,
	printedGenTyping,
	printedGenTypingImport,
	RootValue
} from "@nexus/schema/dist/core";
import { UserInputError } from "apollo-server-micro";
import { GraphQLResolveInfo } from "graphql";
import path from "path";
import { ManualFieldError } from "react-hook-form";
import { object, ObjectSchemaDefinition, ValidationError } from "yup";

/* eslint-disable no-console */

const dirname: string = process.env.PROJECT_DIRNAME
	? path.join(process.env.PROJECT_DIRNAME, "src/server/graphql/nexus/plugins")
	: __dirname;

const fieldYupValidationResolverImport = printedGenTypingImport({
	module: path.join(dirname, "yup-validation.plugin"),
	bindings: ["IFieldYupValidationResolver"]
});

const fieldDefTypes = printedGenTyping({
	optional: true,
	name: "yupValidation",
	description: `
		\`yup\` validation plugin for an individual field. Requires that an object schema
		definition be defined for the input args.
	`,
	type: "IFieldYupValidationResolver<TypeName, FieldName>",
	imports: [fieldYupValidationResolverImport]
});

export type IFieldYupValidationResolver<TypeName extends string, FieldName extends string> = (
	root: RootValue<TypeName>,
	args: ArgsValue<TypeName, FieldName>,
	context: GetGen<"context">,
	info: GraphQLResolveInfo
) => MaybePromise<ObjectSchemaDefinition<DeepPartial<ArgsValue<TypeName, FieldName>>>>;

export const yupValidationPlugin = () => {
	return plugin({
		name: "CustomNexusYupValidation",
		description: `
			The yupValidation plugin provides a field-level, input validation via \`yup\` for a
			schema
		`,
		fieldDefTypes,
		onCreateFieldResolver: (config) => {
			const yupValidation = config.fieldConfig.extensions?.nexus?.config.yupValidation;

			/**
			 * @description If the field doesn't have a yupValidation field, don't worry about
			 *     wrapping the resolver
			 */
			if (yupValidation == null) {
				return;
			}

			if (typeof yupValidation !== "function") {
				console.error(
					new Error(
						`The yupValidation property provided to ${
							config.fieldConfig.name
						} with type ${
							config.fieldConfig.type
						} should be a function, saw ${typeof yupValidation}`
					)
				);

				return;
			}

			return async (parent, args, context, info, next) => {
				const objectSchemaDef: ObjectSchemaDefinition<typeof args> = await yupValidation(
					parent,
					args,
					context,
					info
				);

				let values: typeof args;

				const yupSchema = object().shape(objectSchemaDef);

				try {
					values = await yupSchema.validate(args, {
						abortEarly: false
					});
				} catch (errors) {
					if (!(errors instanceof ValidationError)) {
						throw errors;
					}

					/**
					 * @description Construct invalidArgs in a way that is easily consumed by
					 *     react-hook-form, if form names are the same as inputs. `name` is a
					 *     lodash/(get/set)-compatible path
					 * @author David Lee
					 * @date April 21, 2020
					 */
					const invalidArgs = errors.inner.reduce(
						(fieldErrors, { message, path: name, type = "validation" }) => [
							...fieldErrors,
							{ message, name, type }
						],
						[] as readonly ManualFieldError<any>[]
					);

					throw new UserInputError("Invalid user input", { invalidArgs });
				}

				const casted = yupSchema.cast(values);

				return next(parent, casted, context, info);
			};
		}
	});
};
