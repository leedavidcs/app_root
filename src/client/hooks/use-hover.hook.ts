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

interface IOptions {
	stopPropagation: boolean;
}

const DEFAULT_OPTIONS: IOptions = {
	stopPropagation: false
};

type UseHoverResult<T> = [
	boolean,
	{
		ref: MutableRefObject<T | null>;
		handlers: {
			onMouseOver: (event: MouseEvent<T>) => void;
			onMouseOut: (event: MouseEvent<T>) => void;
		};
	}
];

export const useHover = <T extends Element = Element>(
	initial: boolean,
	options?: Partial<IOptions>,
	ref?: MutableRefObject<T | null>
): UseHoverResult<T> => {
	const [isHovered, setIsHovered] = useState<boolean>(initial);

	const finalOptions: IOptions = { ...DEFAULT_OPTIONS, ...options };

	const createdRef: RefObject<T> = useRef<T>(null);
	const hoverRef: MutableRefObject<T | null> = ref || createdRef;

	const onMouseOver = useCallback(
		(event) => {
			finalOptions.stopPropagation && event.stopPropagation();

			setIsHovered(true);
		},
		[finalOptions.stopPropagation, setIsHovered]
	);

	const onMouseOut = useCallback(
		(event) => {
			finalOptions.stopPropagation && event.stopPropagation();

			setIsHovered(false);
		},
		[finalOptions.stopPropagation, setIsHovered]
	);

	useEffect(() => {
		const elem: T | null = hoverRef.current;

		if (!elem) {
			return;
		}

		elem.addEventListener("mouseover", onMouseOver);
		elem.addEventListener("mouseout", onMouseOut);

		return () => {
			elem.removeEventListener("mouseover", onMouseOver);
			elem.removeEventListener("mouseout", onMouseOut);
		};
	}, [hoverRef, onMouseOver, onMouseOut]);

	const hoverResults = useMemo(
		() => ({
			ref: hoverRef,
			handlers: { onMouseOut, onMouseOver }
		}),
		[hoverRef, onMouseOut, onMouseOver]
	);

	return [isHovered, hoverResults];
};
