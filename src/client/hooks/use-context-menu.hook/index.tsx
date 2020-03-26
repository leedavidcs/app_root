import { Classes, ContextMenu } from "@blueprintjs/core";
import classnames from "classnames";
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
	const { onOpen, onClose } = options || {};

	const classes = useStyles();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onContextMenu = useCallback(
		(event: MouseEvent<T>) => {
			event.preventDefault();

			if (!content) {
				return;
			}

			ContextMenu.show(
				<div className={classnames(Classes.DARK, classes.root)}>{content}</div>,
				{ left: event.clientX, top: event.clientY },
				() => {
					onClose?.();
					setIsOpen(false);
				}
			);

			onOpen?.();
			setIsOpen(true);
		},
		[classes.root, content, onClose, onOpen]
	);

	const close = ContextMenu.hide;

	useEffect(() => () => close(), [close]);

	return [onContextMenu, { close, isOpen }];
};
