const XS = 600;
const SM = 980;
const MD = 1280;
const LG = 1920;

export const BreakpointKeyMap = {
	xs: [0, XS],
	sm: [XS, SM],
	md: [SM, MD],
	lg: [MD, LG],
	xl: [LG, Infinity]
} as const;

const getMediaPx = (width?: number): string =>
	typeof width === "number" && isFinite(width) ? `${width}px` : "none";

export const breakpoints = {
	up: (key: keyof typeof BreakpointKeyMap): string => {
		const minWidth: number = BreakpointKeyMap[key][0];

		return `@media screen and (min-width: ${getMediaPx(minWidth)})`;
	},
	down: (key: keyof typeof BreakpointKeyMap): string => {
		const maxWidth: number | undefined = BreakpointKeyMap[key][1];

		return `@media screen and (max-width: ${getMediaPx(maxWidth)})`;
	},
	only: (key: keyof typeof BreakpointKeyMap): string => {
		const minWidth: number = BreakpointKeyMap[key][0];
		const maxWidth: number | undefined = BreakpointKeyMap[key][1];

		return `@media screen and (min-width: ${getMediaPx(minWidth)}) and (max-width: ${getMediaPx(
			maxWidth
		)})`;
	},
	between: (start: keyof typeof BreakpointKeyMap, end: keyof typeof BreakpointKeyMap): string => {
		const minWidth: number = BreakpointKeyMap[start][0];
		const maxWidth: number | undefined = BreakpointKeyMap[end][1];

		return `@media screen and (min-width: ${getMediaPx(minWidth)}) and (max-width: ${getMediaPx(
			maxWidth
		)})`;
	}
};
