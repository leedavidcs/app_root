import { GraphQLError } from "graphql";
import { useCallback } from "react";
import { FormContextValues } from "react-hook-form";
import { useToast } from "./use-toast.hook";

interface IOptions {
	setError: FormContextValues["setError"];
}

interface IBadUserInputArgInfo {
	message: string;
	value: any;
}

export const useOnFormSubmitError = ({ setError }: IOptions) => {
	const toaster = useToast();

	const onFormError = useCallback(
		(err: any) => {
			if (err instanceof GraphQLError) {
				switch (err.extensions?.code) {
					case "BAD_USER_INPUT": {
						const invalidArgs: Record<string, IBadUserInputArgInfo> =
							err.extensions?.invalidArgs ?? [];

						Object.keys(invalidArgs).forEach((key) =>
							setError(key, invalidArgs[key].message)
						);

						return;
					}
					case "FORBIDDEN":
						toaster.show({
							intent: "danger",
							message: "You do not have permission for this action"
						});

						return;
					default:
				}
			}

			toaster.show({ intent: "danger", message: "Form submission unsuccessful" });
		},
		[setError, toaster]
	);

	return onFormError;
};
