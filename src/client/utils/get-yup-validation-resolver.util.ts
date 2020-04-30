import { ValidationResolver } from "react-hook-form";
import { object, ObjectSchemaDefinition, ValidationError } from "yup";

export const getYupValidationResolver = <TData extends object = any, TContext = {}>(
	validationSchema: (data: TData, context: TContext) => ObjectSchemaDefinition<TData>
) => {
	const validationResolver: ValidationResolver<TData, any> = async (
		data: TData,
		context: TContext
	) => {
		try {
			const values = await object().shape(validationSchema(data, context)).validate(data, {
				abortEarly: false
			});

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
