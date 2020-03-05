import { getYupValidationResolver } from "@/client/utils";
import { useCallback } from "react";
import { ValidationResolver } from "react-hook-form";
import { ObjectSchemaDefinition } from "yup";

export const useYupValidationResolver = <T extends object = any, TContext = {}>(
	validationSchema: (data: T, context: TContext) => ObjectSchemaDefinition<T>
): ValidationResolver<Record<keyof T, any>, any> =>
	useCallback(getYupValidationResolver(validationSchema), [validationSchema]);
