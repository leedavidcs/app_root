import {
	RegisterLocalUserMutation,
	RegisterLocalUserMutationResult,
	RegisterLocalUserMutationVariables,
	useRegisterLocalUserMutation
} from "@/client/graphql";
import type { ExecutionResult } from "@graphql-tools/utils";
import { useCallback } from "react";

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
