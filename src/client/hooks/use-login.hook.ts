import {
	LoginLocalUserMutation,
	LoginLocalUserMutationOptions,
	LoginLocalUserMutationResult,
	LoginLocalUserMutationVariables,
	TokenPayload,
	useLoginLocalUserMutation,
	useSetUserMutation
} from "@/client/graphql";
import { writeCookie } from "@/server/authentication/cookie-utils";
import { useCallback } from "react";
import { ExecutionResult } from "react-apollo";

export const useLogin = (
	options?: LoginLocalUserMutationOptions
): [
	(
		variables: LoginLocalUserMutationVariables
	) => Promise<ExecutionResult<LoginLocalUserMutation>>,
	LoginLocalUserMutationResult
] => {
	const [loginUser, result] = useLoginLocalUserMutation(options);
	const [setUser] = useSetUserMutation();

	const login = useCallback(
		async (variables: LoginLocalUserMutationVariables) => {
			const execResult: ExecutionResult<LoginLocalUserMutation> = await loginUser({
				variables
			});

			const tokens: Maybe<TokenPayload> = execResult.data?.loginLocalUser ?? null;

			if (tokens) {
				const { token, refreshToken } = tokens;

				writeCookie(token, { refreshToken });

				setUser();
			}

			return execResult;
		},
		[loginUser, setUser]
	);

	return [login, result];
};
