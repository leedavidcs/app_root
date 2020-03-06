import { Paper } from "@/client/components/paper.component";
import { Classes, Icon, Overlay } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, ReactElement, SyntheticEvent } from "react";
import { useStyles } from "./styles";

export * from "./modal-provider.component";

interface IProps {
	children?: ReactElement | null;
	isOpen: boolean;
	onClose?: (event?: SyntheticEvent<HTMLElement>) => void;
	title: string;
}

export const Modal: FC<IProps> = ({ children, isOpen, onClose, title }) => {
	const classes = useStyles();

	return (
		<Overlay
			className={Classes.OVERLAY_SCROLL_CONTAINER}
			backdropClassName={classes.root}
			autoFocus={true}
			canEscapeKeyClose={true}
			canOutsideClickClose={true}
			hasBackdrop={true}
			isOpen={isOpen}
			onClose={onClose}
			transitionName={classes.content}
			transitionDuration={500}
			usePortal={true}
		>
			<Paper className={classnames(classes.content)}>
				<h3 className={classnames(classes.title, Classes.DARK, Classes.HEADING)}>
					{title}
					<Icon className={classes.closeBtn} icon="cross" onClick={onClose} />
				</h3>
				{children}
			</Paper>
		</Overlay>
	);
};
