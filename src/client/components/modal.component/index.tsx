import { Classes, Dialog } from "@blueprintjs/core/lib/esm";
import { isEmpty } from "lodash";
import React, { FC, ReactElement, SyntheticEvent } from "react";
import { useStyles } from "./styles";

export * from "./modal-provider.component";

interface IProps {
	children?: ReactElement | null;
	isOpen: boolean;
	onClose?: (event?: SyntheticEvent<HTMLElement>) => void;
	title: string;
	footer?: readonly ReactElement[] | null;
}

export const Modal: FC<IProps> = ({ children, footer, isOpen, onClose, title }) => {
	const classes = useStyles();

	return (
		<Dialog
			className={classes.root}
			backdropClassName={classes.backdrop}
			canEscapeKeyClose={true}
			canOutsideClickClose={true}
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			transitionDuration={500}
			usePortal={true}
		>
			<div className={Classes.DIALOG_BODY}>{children}</div>
			{!isEmpty(footer) && (
				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>{footer}</div>
				</div>
			)}
		</Dialog>
	);
};
