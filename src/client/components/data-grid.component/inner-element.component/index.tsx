import React, { DetailedHTMLProps, forwardRef, HTMLAttributes, memo } from "react";
import { DataGridBody } from "./data-grid-body.component";
import { DataGridHeaders } from "./data-grid-headers.component";

export * from "./data-grid-body.component";
export * from "./data-grid-headers.component";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * @description Inner container element for react-window.FixedSizeList
 * @see innerElementType @ https://react-window.now.sh/#/api/FixedSizeList
 */
export const InnerElement = memo(
	forwardRef<HTMLDivElement, Props>(({ children, ...restProps }, ref) => {
		return (
			<div ref={ref} {...restProps}>
				<DataGridHeaders />
				<DataGridBody>{children}</DataGridBody>
			</div>
		);
	})
);

InnerElement.displayName = "InnerElement";
