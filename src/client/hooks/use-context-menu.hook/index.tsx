import { ContextMenu } from "@blueprintjs/core";
import React, {
	MouseEvent,
	MouseEventHandler,
	ReactElement,
	useCallback,
	useEffect,
	useState
} from "react";
import { useStyles } from "./styles";

interface IOptions {
	disabled?: boolean;
	onOpen?: () => void;
	onClose?: () => void;
}

type UseContextMenuResult<T> = readonly [
	MouseEventHandler<T>,
	{ close: () => void; isOpen: boolean }
];

export const useContextMenu = <T extends Element>(
	content: Maybe<ReactElement>,
	options?: IOptions
): UseContextMenuResult<T> => {
	const { disabled, onOpen, onClose } = options || {};

	const classes = useStyles();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onContextMenu = useCallback(
		(event: MouseEvent<T>) => {
			event.preventDefault();

			if (!content || disabled) {
				return;
			}

			ContextMenu.show(
				<div className={classes.root}>{content}</div>,
				{ left: event.clientX, top: event.clientY },
				() => {
					onClose?.();
					setIsOpen(false);
				}
			);

			onOpen?.();
			setIsOpen(true);
		},
		[classes.root, content, disabled, onClose, onOpen]
	);

	const close = ContextMenu.hide;

	useEffect(() => () => close(), [close]);

	return [onContextMenu, { close, isOpen }];
};
