import { Anchor, TextInput } from "@/client/components";
import {
	LoginLocalUserMutationVariables,
	RegisterLocalUserMutationVariables,
	RegisterLocalUserPayload,
	useResendVerifyEmailMutation
} from "@/client/graphql";
import { useAuth, useModal, useSetUser } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import dynamic from "next/dynamic";
import React, { FC, FormEvent, useCallback, useEffect, useState } from "react";
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
	const [resendVerifyEmail] = useResendVerifyEmailMutation();

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
			{ success, error }: Pick<RegisterLocalUserPayload, "success" | "error">
		): Promise<void> => {
			if (!success) {
				setErrorMessage(error || null);

				return;
			}

			const variables: LoginLocalUserMutationVariables = {
				input: { userIdentifier, password }
			};

			await login({ variables });

			onSuccess?.();
		},
		[login, onSuccess, setErrorMessage]
	);

	const onFormSubmit = useCallback(
		async (data: IFormData): Promise<void> => {
			const { email, password, username } = data;

			const variables: RegisterLocalUserMutationVariables = {
				input: { email, password, username }
			};
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

	const { control, errors, getValues, handleSubmit } = useForm<IFormData>({
		validationResolver
	});

	const setEmail = useSetEmail();
	const onClickSignIn = useSignInHandler();
	const { onPasswordChange } = usePasswordChangeHandler();

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
					control={control}
				/>
				<TextInput
					className={classes.textInput}
					label="Email"
					name="email"
					error={errors.email?.message}
					control={control}
				/>
				<TextInput
					className={classes.textInput}
					label="Password"
					name="password"
					error={errors.password?.message}
					onChange={onPasswordChange}
					type="password"
					control={control}
				/>
				<TextInput
					label="Confirm password"
					name="confirmPassword"
					error={errors.confirmPassword?.message}
					className={classes.textInput}
					type="password"
					control={control}
				/>
				<div className={classes.btnContainer}>
					<Button intent="primary" text="SIGN UP" type="submit" />
				</div>
			</form>
			{errorMessage && <p className={classes.error}>{errorMessage}</p>}
			<div className={classes.signInWrapper}>
				Already a member? {<Anchor value="SIGN IN" onClick={onClickSignIn} />}
			</div>
		</div>
	);
};
