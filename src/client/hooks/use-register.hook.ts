import {
	RegisterLocalUserMutation,
	RegisterLocalUserMutationResult,
	RegisterLocalUserMutationVariables,
	useRegisterLocalUserMutation
} from "@/client/graphql";
import { useCallback } from "react";
import { ExecutionResult } from "react-apollo";

export const useRegister = (): [
	(
		variables: RegisterLocalUserMutationVariables
	) => Promise<ExecutionResult<RegisterLocalUserMutation>>,
	RegisterLocalUserMutationResult
] => {
	const [registerUser, result] = useRegisterLocalUserMutation();

	const register = useCallback(
		async (
			variables: RegisterLocalUserMutationVariables
		): Promise<ExecutionResult<RegisterLocalUserMutation>> => {
			const execResult = await registerUser({ variables });

			return execResult;
		},
		[registerUser]
	);

	return [register, result];
};
