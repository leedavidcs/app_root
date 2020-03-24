import { ContextMenu } from "@blueprintjs/core";
import { MouseEvent, MouseEventHandler, ReactElement, useCallback, useState } from "react";

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

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onContextMenu = useCallback(
		(event: MouseEvent<T>) => {
			event.preventDefault();

			if (!content) {
				return;
			}

			ContextMenu.show(content, { left: event.clientX, top: event.clientY }, () => {
				onClose?.();
				setIsOpen(false);
			});

			onOpen?.();
			setIsOpen(true);
		},
		[content, onClose, onOpen, setIsOpen]
	);

	const close = ContextMenu.hide;

	return [onContextMenu, { close, isOpen }];
};
