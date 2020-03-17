import { debounce } from "lodash";
import { MouseEvent, MutableRefObject, TouchEvent, useCallback, useRef } from "react";

const DOUBLE_CLICK_TIMEOUT = 200;

interface IOptions {
	delay?: number;
	onSingleClick?: (event: MouseEvent | TouchEvent) => void;
	onDoubleClick?: (event: MouseEvent | TouchEvent) => void;
}

export const useDoubleClick = (options?: IOptions) => {
	const {
		delay = DOUBLE_CLICK_TIMEOUT,
		onSingleClick = () => undefined,
		onDoubleClick = () => undefined
	} = options ?? {};

	const hasClicked: MutableRefObject<boolean> = useRef<boolean>(false);

	const cancelableOnClick = useCallback(
		debounce((event: MouseEvent | TouchEvent) => {
			hasClicked.current = false;
			onSingleClick(event);
		}, delay),
		[onSingleClick]
	);

	const onSimulatedDoubleClick = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (hasClicked.current) {
				hasClicked.current = false;

				onDoubleClick(event);

				cancelableOnClick.cancel();

				return;
			}

			cancelableOnClick(event);
			hasClicked.current = true;
		},
		[cancelableOnClick, onDoubleClick]
	);

	return onSimulatedDoubleClick;
};
