import {
	LoginLocalUserMutation,
	LoginLocalUserMutationVariables,
	RegisterLocalUserMutation,
	RegisterLocalUserMutationVariables,
	TokenPayload,
	useLoginLocalUserMutation,
	useRegisterLocalUserMutation
} from "@/client/graphql";
import { useSetUser } from "@/client/hooks/use-set-user.hook";
import { logout, writeCookie } from "@/server/authentication/cookie-utils";
import { ApolloError } from "apollo-boost";
import { NextRouter, useRouter } from "next/router";
import { useCallback } from "react";
import { MutationFunctionOptions } from "react-apollo";

interface IUseAuthOptions {
	onLoginCompleted?: (tokens: Maybe<TokenPayload>) => any;
	onLoginError?: (errors: readonly string[]) => any;
	onRegisterCompleted?: (payload: Maybe<RegisterLocalUserMutation["registerLocalUser"]>) => any;
}

type LoginOptions = MutationFunctionOptions<
	LoginLocalUserMutation,
	LoginLocalUserMutationVariables
>;
type LoginResult = Maybe<TokenPayload>;

type RegisterOptions = MutationFunctionOptions<
	RegisterLocalUserMutation,
	RegisterLocalUserMutationVariables
>;
type RegisterResult = Maybe<RegisterLocalUserMutation["registerLocalUser"]>;

interface IUseAuthResult {
	login: (options: LoginOptions) => Promise<LoginResult>;
	logout: () => void;
	register: (options: RegisterOptions) => Promise<RegisterResult>;
}

const useLogin = ({ onLoginCompleted, onLoginError }: IUseAuthOptions = {}) => {
	const [loginUser] = useLoginLocalUserMutation();
	const [setUser] = useSetUser();

	return useCallback(
		async (options: Parameters<typeof loginUser>[0]): Promise<Maybe<TokenPayload>> => {
			let result;

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
	const [registerUser] = useRegisterLocalUserMutation();

	return useCallback(
		async (
			options: Parameters<typeof registerUser>[0]
		): Promise<Maybe<RegisterLocalUserMutation["registerLocalUser"]>> => {
			const result = await registerUser(options);
			const registerLocalUser = result.data?.registerLocalUser;

			onRegisterCompleted?.(registerLocalUser);

			return registerLocalUser;
		},
		[registerUser, onRegisterCompleted]
	);
};

const useLogout = () => {
	const router: NextRouter = useRouter();
	const [setUser] = useSetUser();

	return useCallback(() => {
		logout();
		setUser();
		router.push("/");
	}, [router, setUser]);
};

export const useAuth = (options: IUseAuthOptions = {}): IUseAuthResult => {
	return {
		login: useLogin(options),
		logout: useLogout(),
		register: useRegister(options)
	};
};
