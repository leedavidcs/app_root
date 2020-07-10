import Keycode from "keycode";
import { KeyboardEvent, KeyboardEventHandler, useCallback } from "react";

export const useKeyDown = <T extends HTMLElement>(
	key: keyof typeof Keycode["codes"],
	callback: KeyboardEventHandler<T>
) => {
	const onKeyDown = useCallback(
		(event: KeyboardEvent<T>): KeyboardEvent<T> => {
			const { keyCode } = event;

			if (keyCode !== Keycode.codes[key]) {
				return event;
			}

			callback(event);

			return event;
		},
		[callback, key]
	);

	return onKeyDown;
};
