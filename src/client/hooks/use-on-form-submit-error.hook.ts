import { GraphQLError } from "graphql";
import { useCallback } from "react";
import { ManualFieldError } from "react-hook-form";
import { useToast } from "./use-toast.hook";

interface IOptions<T extends Record<string, any>> {
	onBadUserInput?: (invalidArgs: ManualFieldError<T>[]) => void;
}

export const useOnFormSubmitError = <T extends Record<string, any>>({
	onBadUserInput
}: IOptions<T>) => {
	const toaster = useToast();

	const onFormError = useCallback(
		(err: any) => {
			if (err instanceof GraphQLError) {
				switch (err.extensions?.code) {
					case "BAD_USER_INPUT": {
						const invalidArgs: ManualFieldError<T>[] =
							err.extensions?.invalidArgs ?? [];

						onBadUserInput?.(invalidArgs);

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
		[onBadUserInput, toaster]
	);

	return onFormError;
};
