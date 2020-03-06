import { Anchor, Button, PasswordStrength, TextInput } from "@/client/components";
import {
	LoginLocalUserVariables,
	Mutations,
	RegisterLocalUserVariables,
	RegisterLocalUser_registerLocalUser,
	ResendVerifyEmail
} from "@/client/graphql";
import { useAuth, useModal, useSetUser } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import dynamic from "next/dynamic";
import React, { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { useStyles } from "./styles";

const SignInModal = dynamic(() => import("@/client/modals/sign-in.modal"));
const VerifyEmailModal = dynamic(() => import("@/client/modals/verify-email.modal"));

interface IFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const validationSchema = ({ password }: IFormData) => ({
	username: string().required("Username is required"),
	email: string().required("Email is required"),
	password: string().required("Password is required"),
	confirmPassword: string().test(
		"confirmPassword",
		"Passwords do not match",
		(text) => text === password
	)
});

const validationResolver = getYupValidationResolver(validationSchema);

/**
 * @description Returns a setState<string>, that toggles a modal content to a verify-email form.
 *     This is used for after a user is successfully signed-up.
 */
const useSetEmail = () => {
	const [email, setEmail] = useState<string>("");
	const [resendVerifyEmail] = useMutation<ResendVerifyEmail>(Mutations.ResendVerifyEmail);

	const { setContent, toggle } = useModal();

	const onCompleted = useCallback(() => {
		setContent({
			title: "Confirm your email address",
			body: <VerifyEmailModal email={email} onClickResend={resendVerifyEmail} />
		});
		toggle(true);
	}, [email, resendVerifyEmail, setContent, toggle]);

	const [setUser] = useSetUser({ onCompleted });

	useEffect(() => {
		email && setUser();
	}, [email, setUser]);

	return setEmail;
};

/**
 * @description This is the onClick handler for if the user clicks to sign-in, instad of
 *     submitting the sign-up form.
 */
const useSignInHandler = () => {
	const { setContent, toggle } = useModal();

	return useCallback(() => {
		setContent({ title: "Sign in", body: <SignInModal /> });
		toggle(true);
	}, [setContent, toggle]);
};

/**
 * @description This is the handler for when the form is submitted. If successful, the user will be
 *     registered and logged-in.
 */
const useFormSubmitHandler = (onSuccess?: () => void) => {
	const { login, register } = useAuth();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleRegisterPayload = useCallback(
		async (
			{ email: userIdentifier, password }: IFormData,
			{ success, error }: RegisterLocalUser_registerLocalUser
		): Promise<void> => {
			if (!success) {
				setErrorMessage(error);

				return;
			}

			const variables: LoginLocalUserVariables = {
				input: { userIdentifier, password }
			};

			await login({ variables });

			onSuccess?.();
		},
		[login, onSuccess, setErrorMessage]
	);

	const onFormSubmit = useCallback(
		async (data: IFormData): Promise<void> => {
			const variables: RegisterLocalUserVariables = { input: data };
			const result = await register({ variables });

			return result
				? handleRegisterPayload(data, result)
				: setErrorMessage("Unexpected error. Please try again");
		},
		[handleRegisterPayload, register, setErrorMessage]
	);

	return { errorMessage, onFormSubmit };
};

const usePasswordChangeHandler = () => {
	const [password, setPassword] = useState<string>("");

	const onPasswordChange = useCallback(
		(event: FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value),
		[setPassword]
	);

	return { password, onPasswordChange };
};

export const SignUpForm: FC = () => {
	const classes = useStyles();

	const { errors, getValues, handleSubmit, register } = useForm<IFormData>({
		validationResolver
	});

	const setEmail = useSetEmail();
	const onClickSignIn = useSignInHandler();
	const { password, onPasswordChange } = usePasswordChangeHandler();

	const onSuccess = useCallback(() => setEmail(getValues().email), [setEmail, getValues]);
	const { errorMessage, onFormSubmit } = useFormSubmitHandler(onSuccess);
	const onSubmit = useCallback(handleSubmit(onFormSubmit), [handleSubmit, onFormSubmit]);

	return (
		<div className={classes.root}>
			<form className={classes.formWrapper} onSubmit={onSubmit}>
				<TextInput
					className={classes.textInput}
					label="Username"
					name="username"
					error={errors.username?.message}
					ref={register}
				/>
				<TextInput
					className={classes.textInput}
					label="Email"
					name="email"
					error={errors.email?.message}
					ref={register}
				/>
				<TextInput
					className={classes.textInput}
					label="Password"
					name="password"
					error={errors.password?.message}
					onChange={onPasswordChange}
					type="password"
					ref={register}
				/>
				<PasswordStrength className={classes.passwordStrength} password={password} />
				<TextInput
					label="Confirm password"
					name="confirmPassword"
					error={errors.confirmPassword?.message}
					className={classes.textInput}
					type="password"
					ref={register}
				/>
				<div className={classes.btnContainer}>
					<Button className={classes.signUpBtn} type="submit">
						SIGN UP
					</Button>
				</div>
			</form>
			{errorMessage ? <div className={classes.error}>{errorMessage}</div> : null}
			<div className={classes.signInWrapper}>
				Already a member? {<Anchor value="SIGN IN" onClick={onClickSignIn} />}
			</div>
		</div>
	);
};
