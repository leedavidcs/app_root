import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export const useFocus = <T extends Element = Element>(
	initial: boolean,
	ref?: RefObject<T>
): [boolean, RefObject<T>] => {
	const [isFocused, setIsFocused] = useState<boolean>(initial);

	const createdRef: RefObject<T> = useRef<T>(null);
	const focusRef: RefObject<T> = ref || createdRef;

	const onFocus = useCallback(() => setIsFocused(true), [setIsFocused]);
	const onBlur = useCallback(() => setIsFocused(false), [setIsFocused]);

	useEffect(() => {
		const elem: T | null = focusRef.current;

		if (!elem) {
			return;
		}

		elem.addEventListener("focus", onFocus);
		elem.addEventListener("blur", onBlur);

		return () => {
			elem.removeEventListener("focus", onFocus);
			elem.removeEventListener("blur", onBlur);
		};
	}, [focusRef, onFocus, onBlur]);

	return [isFocused, focusRef];
};
