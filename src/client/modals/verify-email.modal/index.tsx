import { Anchor } from "@/client/components";
import React, { FC, useMemo } from "react";
import { useStyles } from "./styles";

interface IProps {
	email: string;
	onClickResend: () => void;
}

export const VerifyEmailModal: FC<IProps> = ({ email, onClickResend }) => {
	const classes = useStyles();

	const resendBtn = useMemo(
		() => <Anchor className={classes.resendBtn} value="HERE" onClick={onClickResend} />,
		[classes.resendBtn, onClickResend]
	);

	return (
		<div className={classes.root}>
			<p>
				A confirmation email has been sent to{" "}
				<strong className={classes.email}>{email}</strong>.
			</p>
			<p>
				If you don&apos;t see a message in your inbox, make sure that the email address
				above is correct, and check your spam folder.
			</p>
			<p>Click {resendBtn} to resend the email.</p>
		</div>
	);
};

export default VerifyEmailModal;
