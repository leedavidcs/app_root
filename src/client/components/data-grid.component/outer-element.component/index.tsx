import { ScrollContext } from "@/client/components/data-grid.component";
import React, {
	DetailedHTMLProps,
	forwardRef,
	HTMLAttributes,
	UIEvent,
	useCallback,
	useContext
} from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * @description Outer container element for react-window.FixedSizeList
 * @see innerElementType @ https://react-window.now.sh/#/api/FixedSizeList
 */
export const OuterElement = forwardRef<HTMLDivElement, Props>(
	({ children, onScroll: propsOnScroll, ...restProps }, ref) => {
		const { onHorizontalScroll, onVerticalScroll } = useContext(ScrollContext);

		const onScroll = useCallback(
			(event: UIEvent<HTMLDivElement>) => {
				propsOnScroll?.(event);

				const xOffset: number = event.currentTarget.scrollLeft;
				const yOffset: number = event.currentTarget.scrollTop;

				onHorizontalScroll(xOffset);
				onVerticalScroll(yOffset);
			},
			[onHorizontalScroll, onVerticalScroll, propsOnScroll]
		);

		return (
			<div ref={ref} {...restProps} onScroll={onScroll}>
				{children}
			</div>
		);
	}
);

OuterElement.displayName = "OuterElement";
