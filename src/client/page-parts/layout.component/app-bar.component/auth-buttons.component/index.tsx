import { Button } from "@/client/components";
import { useModal } from "@/client/hooks";
import classnames from "classnames";
import dynamic from "next/dynamic";
import React, { FC, useCallback } from "react";
import { useStyles } from "./styles";

const SignInModal = dynamic(() => import("@/client/modals/sign-in.modal"));
const SignUpModal = dynamic(() => import("@/client/modals/sign-up.modal"));

interface IProps {
	className?: string;
}

export const AuthButtons: FC<IProps> = ({ className }) => {
	const classes = useStyles();

	const { setContent, toggle } = useModal();

	const onClickSignIn = useCallback(() => {
		setContent({ title: "Sign in", body: <SignInModal /> });
		toggle(true);
	}, [setContent, toggle]);

	const onClickSignUp = useCallback(() => {
		setContent({ title: "Sign up", body: <SignUpModal /> });
		toggle(true);
	}, [setContent, toggle]);

	return (
		<div className={classnames(classes.root, className)}>
			<Button
				className={classes.btn}
				onClick={onClickSignIn}
				outlined={true}
				text="SIGN IN"
			/>
			<Button
				className={classes.btn}
				intent="primary"
				onClick={onClickSignUp}
				text="SIGN UP"
			/>
		</div>
	);
};
