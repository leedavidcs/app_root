import { Resolver } from "react-hook-form";
import { object, ObjectSchemaDefinition, ValidationError } from "yup";

export const getYupValidationResolver = <TData extends object = any, TContext = {}>(
	validationSchema: (data: TData, context: TContext) => ObjectSchemaDefinition<DeepPartial<TData>>
) => {
	const validationResolver: Resolver<TData, any> = async (data: TData, context: TContext) => {
		try {
			const values = (await object(validationSchema(data, context))
				.required()
				.validate(data, { abortEarly: false })) as TData;

			return { values, errors: {} };
		} catch (errors) {
			if (!(errors instanceof ValidationError)) {
				throw errors;
			}

			return {
				values: {},
				errors: errors.inner.reduce(
					(fieldErrors, { message, path, type = "validation" }) => ({
						...fieldErrors,
						[path]: { message, type }
					}),
					{}
				)
			};
		}
	};

	return validationResolver;
};
