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

type UsePressedResult<T> = [
	boolean,
	{
		ref: MutableRefObject<T | null>;
		handlers: {
			onMouseDown: (event: MouseEvent<T>) => void;
			onMouseUp: (event: MouseEvent<T>) => void;
		};
	}
];

export const usePressed = <T extends Element = Element>(
	initial: boolean,
	ref?: RefObject<T>
): UsePressedResult<T> => {
	const [isPressed, setIsPressed] = useState<boolean>(initial);

	const createdRef: RefObject<T> = useRef<T>(null);
	const pressedRef: RefObject<T> = ref || createdRef;

	const onMouseDown = useCallback(() => setIsPressed(true), []);
	const onMouseUp = useCallback(() => setIsPressed(false), []);

	useEffect(() => {
		const elem: T | null = pressedRef.current;

		if (!elem) {
			return;
		}

		elem.addEventListener("mousedown", onMouseDown);
		elem.addEventListener("mouseup", onMouseUp);

		return () => {
			elem.removeEventListener("mousedown", onMouseDown);
			elem.removeEventListener("mouseup", onMouseUp);
		};
	}, [onMouseDown, onMouseUp, pressedRef]);

	const pressedResult = useMemo(
		() => ({
			ref: pressedRef,
			handlers: { onMouseDown, onMouseUp }
		}),
		[onMouseDown, onMouseUp, pressedRef]
	);

	return [isPressed, pressedResult];
};
