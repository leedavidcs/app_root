import { Anchor, Button, TextInput } from "@/client/components";
import { LoginLocalUserVariables } from "@/client/graphql";
import { useAuth, useModal, useSetUser, useYupValidationResolver } from "@/client/hooks";
import dynamic from "next/dynamic";
import React, { FC, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { useStyles } from "./styles";

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
	const [didSucceed, setDidSucceed] = useState<boolean>(false);

	const { login } = useAuth();
	const { setContent, toggle } = useModal();

	const onCompleted = useCallback(() => {
		toggle(false);
		setContent(null);
	}, [setContent, toggle]);

	const [setUser] = useSetUser({ onCompleted });

	const onFormSubmit = useCallback(
		async (data: IFormData): Promise<void> => {
			const variables: LoginLocalUserVariables = { input: data };
			const result = await login({ variables });

			if (result) {
				onSuccess?.();
				setUser();
			}

			setDidSucceed(Boolean(result));
		},
		[login, onSuccess, setDidSucceed, setUser]
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
		errors,
		formState: { isSubmitted },
		handleSubmit,
		register
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
	const passwordError: string | boolean = didSubmit && !didSucceed && "Password is invalid";

	return (
		<div>
			<form className={classes.root} onSubmit={onSubmit}>
				<div className={classes.formWrapper}>
					<TextInput
						className={classes.textInput}
						label="Username or Email"
						name="userIdentifier"
						error={errors.userIdentifier?.message}
						variant="outlined"
						ref={register}
					/>
					<TextInput
						className={classes.textInput}
						label="Password"
						name="password"
						type="password"
						error={passwordError}
						variant="outlined"
						ref={register}
					/>
					<div className={classes.btnContainer}>
						<Button className={classes.signInBtn} type="submit">
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
