import Keycode from "keycode";
import { KeyboardEventHandler, useCallback } from "react";

export const useKeyDown = <T extends HTMLElement>(
	key: keyof typeof Keycode["codes"],
	callback: KeyboardEventHandler<T>
) => {
	const onKeyDown: KeyboardEventHandler<T> = useCallback(
		(event) => {
			const { keyCode } = event;

			if (keyCode !== Keycode.codes[key]) {
				return;
			}

			callback(event);
		},
		[callback, key]
	);

	return onKeyDown;
};
