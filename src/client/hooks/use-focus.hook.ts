import {
	MouseEvent,
	MutableRefObject,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

type UseFocusResult<T> = [
	boolean,
	{
		ref: MutableRefObject<T | null>;
		handlers: {
			onFocus: (event: MouseEvent<T>) => void;
			onBlur: (event: MouseEvent<T>) => void;
		};
	}
];

export const useFocus = <T extends Element = Element>(
	initial: boolean,
	ref?: RefObject<T>
): UseFocusResult<T> => {
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

	const focusResult = useMemo(
		() => ({
			ref: focusRef,
			handlers: { onFocus, onBlur }
		}),
		[focusRef, onBlur, onFocus]
	);

	return [isFocused, focusResult];
};
