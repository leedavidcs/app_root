import Keycode from "keycode";
import { KeyboardEvent, KeyboardEventHandler, useCallback } from "react";

type KeyMap = Partial<Record<keyof typeof Keycode["codes"], () => void>>;
type CodeMap = Record<string | number, () => void>;

export const useKeyDown = <T extends HTMLElement>(
	keyMap: KeyMap,
	fallback: () => void = () => undefined
) => {
	const onKeyDown: KeyboardEventHandler<T> = useCallback(
		({ keyCode }: KeyboardEvent<T>) => {
			const keys = Object.keys(keyMap);

			const codeMap = keys.reduce<CodeMap>(
				(acc, key) => ({
					...acc,
					[Keycode.codes[key]]: keyMap[key]
				}),
				{ default: fallback }
			);

			const handler: () => void = codeMap[keyCode] ?? codeMap.default;

			handler();
		},
		[fallback, keyMap]
	);

	return onKeyDown;
};
