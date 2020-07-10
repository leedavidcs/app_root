import { Anchor, Button, TextInput } from "@/client/components";
import {
	GetUserDocument,
	RegisterLocalUserPayload,
	useResendVerifyEmailMutation,
	useSetUserMutation
} from "@/client/graphql";
import { useLogin, useModal, useRegister } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
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

const resolver = getYupValidationResolver(({ password }: IFormData) => ({
	username: string().required("Username is required"),
	email: string().required("Email is required"),
	password: string().required("Password is required"),
	confirmPassword: string().test(
		"confirmPassword",
		"Passwords do not match",
		(text) => text === password
	)
}));

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

	const [setUser] = useSetUserMutation({
		awaitRefetchQueries: true,
		refetchQueries: [{ query: GetUserDocument }],
		onCompleted
	});

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
	const [login] = useLogin();
	const [register] = useRegister();
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

			await login({ input: { userIdentifier, password } });

			onSuccess?.();
		},
		[login, onSuccess, setErrorMessage]
	);

	const onFormSubmit = useCallback(
		async (data: IFormData): Promise<void> => {
			const { email, password, username } = data;

			const registerResult = await register({ input: { email, password, username } });
			const registerPayload = registerResult.data?.registerLocalUser ?? null;

			return registerPayload
				? handleRegisterPayload(data, registerPayload)
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

	const { control, errors, getValues, handleSubmit } = useForm<IFormData>({ resolver });

	const setEmail = useSetEmail();
	const onClickSignIn = useSignInHandler();
	const { onPasswordChange } = usePasswordChangeHandler();

	const onSuccess = useCallback(() => setEmail(getValues().email), [setEmail, getValues]);
	const { errorMessage, onFormSubmit } = useFormSubmitHandler(onSuccess);
	const onSubmit = useCallback(onFormSubmit, [handleSubmit, onFormSubmit]);

	return (
		<div className={classes.root}>
			<form className={classes.formWrapper} onSubmit={handleSubmit(onSubmit)}>
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
