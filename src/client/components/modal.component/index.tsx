import { ClickOutside } from "@/client/components/click-outside.component";
import { Paper } from "@/client/components/paper.component";
import React, { FC, ReactElement, useCallback, useEffect, useRef } from "react";
import { FaRegWindowClose } from "react-icons/fa";
import { useStyles } from "./styles";

export * from "./modal-provider.component";

const DEFAULT_TRANSITION_MS = 200;

interface IProps {
	/** Whether this modal is open or not */
	active: boolean;
	/** The contents (body) of the modal */
	children?: ReactElement | null;
	/**
	 * Handler for when the `x` (close) button is clicked on
	 *
	 * @default () => undefined
	 */
	onClose?: () => void;
	/**
	 * Handler for when the user clicks outside of the modal component
	 *
	 * @default () => undefined
	 */
	onClickOut?: () => void;
	/** Text that is used in the top-bar (header) of the modal */
	title?: string;
	/**
	 * If {animate} is true, this sets the transition duration in milliseconds
	 *
	 * @default 200
	 */
	transition?: number;
}

export const Modal: FC<IProps> = ({
	active,
	children,
	onClickOut: propsOnClickOut = () => undefined,
	onClose: propsOnClose = () => undefined,
	title = "",
	transition = DEFAULT_TRANSITION_MS
}) => {
	const classes = useStyles({ active, transition });
	const paperRef = useRef<HTMLDivElement>(null);

	const onClose = useCallback((): void => {
		propsOnClose();
	}, [propsOnClose]);

	const onClickOut = useCallback((): void => {
		if (!active) {
			return;
		}

		propsOnClickOut();
	}, [active, propsOnClickOut]);

	useEffect(() => {
		const paperDiv: HTMLDivElement | null = paperRef.current;

		paperDiv?.classList.toggle(classes.active, active);
	}, [active, classes.active]);

	return (
		<ClickOutside onClick={onClickOut}>
			<Paper className={classes.root} ref={paperRef}>
				<div className={classes.title}>
					{title}
					<div className={classes.closeBtn} onClick={onClose}>
						<FaRegWindowClose />
					</div>
				</div>
				<div className={classes.content}>{children}</div>
			</Paper>
		</ClickOutside>
	);
};
