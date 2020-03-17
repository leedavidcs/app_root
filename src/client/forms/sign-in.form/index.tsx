import { Anchor, TextInput } from "@/client/components";
import { MutationLoginLocalUserArgs } from "@/client/graphql";
import { useAuth, useModal, useSetUser, useYupValidationResolver } from "@/client/hooks";
import { Button } from "@blueprintjs/core";
import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import React, { FC, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { useStyles } from "./styles";

const FORM_SUBMIT_REDIRECT_DELAY = 500;

const SignUpModal = dynamic(() => import("@/client/modals/sign-up.modal"));

interface IFormData {
	password: string;
	userIdentifier: string;
}

interface IFormValidationContext {
	didSubmit: boolean;
	didSucceed: boolean;
}

/**
 * @todo Should implement this handler later
 * @author David Lee
 * @date February 21, 2019
 */
const useForgotPasswordHandler = () => useCallback(() => undefined, []);

/**
 * @description This is the onClick handler for if the user clicks to sign-up, instead of sign-in.
 */
const useSignUpHandler = () => {
	const { setContent, toggle } = useModal();

	return useCallback(() => {
		setContent({
			title: "Sign up",
			body: <SignUpModal />
		});
		toggle(true);
	}, [setContent, toggle]);
};

/**
 * @description This is the handler for when the form is submitted. If successful, the user will be
 *     logged-in.
 */
const useFormSubmitHandler = (onSuccess?: () => void) => {
	const router: NextRouter = useRouter();

	const [didSucceed, setDidSucceed] = useState<boolean>(false);

	const { login } = useAuth();
	const { toggle } = useModal();

	const onCompleted = useCallback(() => toggle(false), [toggle]);

	const [setUser] = useSetUser({ onCompleted });

	const onFormSubmit = useCallback(
		async (data: IFormData): Promise<void> => {
			const variables: MutationLoginLocalUserArgs = { input: data };
			const result = await login({ variables });

			if (result) {
				onSuccess?.();
				setUser();
			}

			setDidSucceed(Boolean(result));

			setTimeout(() => {
				router.push("/");
			}, FORM_SUBMIT_REDIRECT_DELAY);
		},
		[login, onSuccess, router, setDidSucceed, setUser]
	);

	return { didSucceed, onFormSubmit };
};

/**
 * @description Derives the validation resolver for the useForm hook.
 */
const useValidationResolver = (context: IFormValidationContext) => {
	const validationSchema = useCallback(
		(data: IFormData, { didSubmit, didSucceed }: typeof context) => ({
			userIdentifier: string().required("Username or email is required"),
			password: string()
		}),
		[context]
	);

	const validationResolver = useYupValidationResolver(validationSchema);

	return validationResolver;
};

export const SignInForm: FC = () => {
	const classes = useStyles();

	const [didSubmit, setDidSubmit] = useState<boolean>(false);

	const { didSucceed, onFormSubmit } = useFormSubmitHandler();
	const onClickForgotPassword = useForgotPasswordHandler();
	const onClickSignUp = useSignUpHandler();

	const validationContextRef: MutableRefObject<IFormValidationContext> = useRef({
		didSubmit: false,
		didSucceed
	});
	const validationResolver = useValidationResolver(validationContextRef.current);

	const {
		control,
		errors,
		formState: { isSubmitted },
		handleSubmit
	} = useForm<IFormData>({
		validationContext: validationContextRef.current,
		validateCriteriaMode: "all",
		validationResolver
	});

	useEffect(() => {
		validationContextRef.current.didSubmit = isSubmitted;
		setDidSubmit(isSubmitted);
	}, [isSubmitted]);

	const onSubmit = useCallback(handleSubmit(onFormSubmit), [handleSubmit, onFormSubmit]);
	const passwordError: Maybe<string> = didSubmit && !didSucceed ? "Password is invalid" : null;

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className={classes.formWrapper}>
					<TextInput
						className={classes.textInput}
						label="Username or Email"
						name="userIdentifier"
						error={errors.userIdentifier?.message}
						control={control}
					/>
					<TextInput
						className={classes.textInput}
						label="Password"
						name="password"
						type="password"
						error={passwordError}
						control={control}
					/>
					<div className={classes.btnContainer}>
						<Button intent="primary" type="submit">
							SIGN IN
						</Button>
					</div>
				</div>
			</form>
			{didSubmit && didSucceed ? (
				<div className={classes.successSignIn}>You are now logged in.</div>
			) : null}
			<Anchor
				className={classes.forgotPassword}
				value="Forgot password?"
				onClick={onClickForgotPassword}
			/>
			<div className={classes.signUpWrapper}>
				First time here? <Anchor value="SIGN UP" onClick={onClickSignUp} />
			</div>
		</div>
	);
};
