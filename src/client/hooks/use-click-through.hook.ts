import memoizeOne from "memoize-one";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from "react";

interface IOptions {
	event: "click" | "mousedown" | "mouseup";
}

const optionKeys: readonly (keyof IOptions)[] = ["event"];

type Overload = {
	<T extends HTMLElement>(
		handler: (event: MouseEvent) => void,
		ref?: MutableRefObject<T | null>,
		options?: Partial<IOptions>
	): [MutableRefObject<T | null>];
	<T extends HTMLElement>(handler: (event: MouseEvent) => void, options?: Partial<IOptions>): [
		MutableRefObject<T | null>
	];
};

const isOptions = memoizeOne((value: any): value is Partial<IOptions> => {
	if (typeof value !== "object") {
		return false;
	}

	const keys: readonly string[] = Object.keys(value);

	return keys.findIndex((key) => optionKeys.includes(key as any)) === 1;
});

/**
 * @description Allows a mouse event to be set on an element, even if the element cannot be
 *     directly clicked on
 * @author David Lee
 * @date January 23, 2020
 */
const isEventWithinBounds = (event: MouseEvent, bounds: DOMRect): boolean => {
	const { top, bottom, left, right } = bounds;
	const { clientX: x, clientY: y } = event;

	const isWithinHorizontalBounds: boolean = x >= left && x <= right;
	const isWithinVerticalBounds: boolean = y >= top && y <= bottom;

	return isWithinHorizontalBounds && isWithinVerticalBounds;
};

export const useClickThrough: Overload = <T extends HTMLElement>(
	handler: (event: MouseEvent) => void,
	ref?: MutableRefObject<T | null> | Partial<IOptions>,
	options?: Partial<IOptions>
): [MutableRefObject<T | null>] => {
	const finalOptions: IOptions = useMemo(
		() => ({
			event: "click",
			...(isOptions(ref) ? ref : options)
		}),
		[ref, options]
	);

	const createdRef = useRef<T | null>(null);
	const finalRef: MutableRefObject<T | null> = (!isOptions(ref) && ref) || createdRef;

	const onClick = useCallback(
		(event: MouseEvent) => {
			const elem: T | null = finalRef.current;

			if (!elem) {
				return;
			}

			const bounds: DOMRect = elem.getBoundingClientRect();

			if (!isEventWithinBounds(event, bounds)) {
				return;
			}

			const { clientX, clientY, screenX, screenY } = event;

			handler(
				new MouseEvent(finalOptions.event, {
					clientX,
					clientY,
					screenX,
					screenY,
					relatedTarget: elem
				})
			);
		},
		[handler, finalRef, finalOptions.event]
	);

	useEffect(() => {
		document.addEventListener(finalOptions.event, onClick);

		return () => document.removeEventListener(finalOptions.event, onClick);
	}, [onClick, finalOptions.event]);

	return [finalRef];
};
