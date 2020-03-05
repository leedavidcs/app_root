import {
	LoginLocalUser,
	LoginLocalUserVariables,
	LoginLocalUser_loginLocalUser,
	Mutations,
	RegisterLocalUser,
	RegisterLocalUserVariables,
	RegisterLocalUser_registerLocalUser
} from "@/client/graphql";
import { useSetUser } from "@/client/hooks/use-set-user.hook";
import { logout, writeCookie } from "@/server/authentication/cookie-utils";
import { ApolloError, ExecutionResult } from "apollo-boost";
import { useCallback } from "react";
import { MutationFunctionOptions, useMutation } from "react-apollo";

interface IUseAuthOptions {
	onLoginCompleted?: (tokens: Maybe<LoginLocalUser["loginLocalUser"]>) => any;
	onLoginError?: (errors: readonly string[]) => any;
	onRegisterCompleted?: (tokens: Maybe<RegisterLocalUser["registerLocalUser"]>) => any;
}

type LoginOptions = MutationFunctionOptions<LoginLocalUser, LoginLocalUserVariables>;
type LoginResult = Maybe<LoginLocalUser["loginLocalUser"]>;

type RegisterOptions = MutationFunctionOptions<RegisterLocalUser, RegisterLocalUserVariables>;
type RegisterResult = Maybe<RegisterLocalUser["registerLocalUser"]>;

interface IUseAuthResult {
	login: (options: LoginOptions) => Promise<LoginResult>;
	logout: () => void;
	register: (options: RegisterOptions) => Promise<RegisterResult>;
}

const useLogin = ({ onLoginCompleted, onLoginError }: IUseAuthOptions = {}) => {
	const [loginUser] = useMutation<LoginLocalUser, LoginLocalUserVariables>(
		Mutations.LoginLocalUser
	);
	const [setUser] = useSetUser();

	return useCallback(
		async (
			options: Parameters<typeof loginUser>[0]
		): Promise<Maybe<LoginLocalUser_loginLocalUser>> => {
			let result: ExecutionResult<LoginLocalUser>;

			try {
				result = await loginUser(options);
			} catch (err) {
				const errorMessages: readonly string[] =
					err instanceof ApolloError
						? err.graphQLErrors.map(({ message }) => message)
						: ["Unexpected error. Please try again."];

				onLoginError?.(errorMessages);

				return null;
			}

			const tokens = result.data?.loginLocalUser;

			if (tokens) {
				const { token, refreshToken } = tokens;

				writeCookie(token, { refreshToken });
				setUser();
			}

			onLoginCompleted?.(tokens);

			return tokens;
		},
		[loginUser, onLoginCompleted, onLoginError, setUser]
	);
};

const useRegister = ({ onRegisterCompleted }: IUseAuthOptions = {}) => {
	const [registerUser] = useMutation<RegisterLocalUser, RegisterLocalUserVariables>(
		Mutations.RegisterLocalUser
	);

	return useCallback(
		async (
			options: Parameters<typeof registerUser>[0]
		): Promise<Maybe<RegisterLocalUser_registerLocalUser>> => {
			const result = await registerUser(options);
			const registerLocalUser = result.data?.registerLocalUser;

			onRegisterCompleted?.(registerLocalUser);

			return registerLocalUser;
		},
		[registerUser, onRegisterCompleted]
	);
};

const useLogout = () => {
	const [setUser] = useSetUser();

	return useCallback(() => {
		logout();
		setUser();
	}, [setUser]);
};

export const useAuth = (options: IUseAuthOptions = {}): IUseAuthResult => {
	return {
		login: useLogin(options),
		logout: useLogout(),
		register: useRegister(options)
	};
};
