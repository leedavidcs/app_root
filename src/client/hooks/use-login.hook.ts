import {
	GetUserDocument,
	LoginLocalUserMutation,
	LoginLocalUserMutationOptions,
	LoginLocalUserMutationResult,
	LoginLocalUserMutationVariables,
	TokenPayload,
	useLoginLocalUserMutation,
	useSetUserMutation
} from "@/client/graphql";
import { writeCookie } from "@/server/authentication/cookie-utils";
import type { ExecutionResult } from "graphql-tools";
import { useCallback } from "react";
import { useToast } from "./use-toast.hook";

export const useLogin = (
	options?: LoginLocalUserMutationOptions
): [
	(
		variables: LoginLocalUserMutationVariables
	) => Promise<ExecutionResult<LoginLocalUserMutation>>,
	LoginLocalUserMutationResult
] => {
	const toaster = useToast();

	const [loginUser, result] = useLoginLocalUserMutation(options);
	const [setUser] = useSetUserMutation({
		refetchQueries: [{ query: GetUserDocument }]
	});

	const login = useCallback(
		async (variables: LoginLocalUserMutationVariables) => {
			const execResult: ExecutionResult<LoginLocalUserMutation> = await loginUser({
				variables
			});

			const tokens: Maybe<TokenPayload> = execResult.data?.loginLocalUser ?? null;

			if (tokens) {
				const { token, refreshToken } = tokens;

				writeCookie(token, { refreshToken });

				await setUser();

				toaster.show({ intent: "success", message: "You are now signed in" });
			}

			return execResult;
		},
		[loginUser, setUser, toaster]
	);

	return [login, result];
};
