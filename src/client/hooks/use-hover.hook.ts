import { MutableRefObject, RefObject, useCallback, useEffect, useRef, useState } from "react";

interface IOptions {
	stopPropagation: boolean;
}

const DEFAULT_OPTIONS: IOptions = {
	stopPropagation: false
};

export const useHover = <T extends Element = Element>(
	initial: boolean,
	options?: Partial<IOptions>,
	ref?: MutableRefObject<T | null>
): [boolean, MutableRefObject<T | null>] => {
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

	return [isHovered, hoverRef];
};
