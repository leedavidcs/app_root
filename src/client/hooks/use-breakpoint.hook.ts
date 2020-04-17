import { BreakpointKeyMap, breakpoints } from "@/client/themes";
import { useMemo, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";

const getWidthRange = (
	type: keyof typeof breakpoints,
	breakpoint: keyof typeof BreakpointKeyMap,
	endBreakpoint?: keyof typeof BreakpointKeyMap
): [number, number] => {
	const [min, max] = BreakpointKeyMap[breakpoint];

	switch (type) {
		case "up":
			return [min, Infinity];
		case "down":
			return [0, max];
		case "only":
			return [min, max];
		case "between": {
			const endMax: Maybe<number> = endBreakpoint && BreakpointKeyMap[endBreakpoint]?.[1];

			return [min, endMax ?? Infinity];
		}
		default:
			throw new Error("Invalid breakpoint type");
	}
};

const isWithinRange = (width: number, [min, max]: [number, number]): boolean => {
	return width >= min && width <= max;
};

export const useBreakpoint = (
	type: keyof typeof breakpoints,
	breakpoint: keyof typeof BreakpointKeyMap,
	endBreakpoint?: keyof typeof BreakpointKeyMap
) => {
	const [isBreakpoint, setIsBreakpoint] = useState<boolean>(false);

	const ref = useRef(document.body);

	const targetWidthRange = useMemo(() => getWidthRange(type, breakpoint, endBreakpoint), [
		breakpoint,
		endBreakpoint,
		type
	]);

	useResizeObserver({
		ref,
		onResize: ({ width = 1 }) => setIsBreakpoint(isWithinRange(width, targetWidthRange))
	});

	return isBreakpoint;
};
