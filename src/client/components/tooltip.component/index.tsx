import { ClickOutside } from "@/client/components/click-outside.component";
import { ITooltipLocation, useIsomorphicLayoutEffect, useTooltip } from "@/client/hooks";
import { Placement } from "@popperjs/core";
import classnames from "classnames";
import { identity } from "lodash";
import memoizeOne from "memoize-one";
import React, {
	CSSProperties,
	FC,
	isValidElement,
	ReactElement,
	ReactNode,
	useMemo,
	useRef
} from "react";
import { createPortal } from "react-dom";
import { useStyles } from "./styles";

interface IProps {
	/** Whether the tooltip is open or closed */
	active?: boolean;
	/** The reference element, that the tooltip is positioned around */
	children: ReactNode | ITooltipLocation;
	/** Optional classes to be passed to the `div` wrapper around the reference element */
	className?: string;
	/** Optional classes to be passed to the `div` wrapper around the popper element */
	popperClassName?: string;
	/** The `popper` placement */
	direction: Placement;
	/** Handler for when the user clicks outside of the reference and tooltip */
	onClickOut?: () => void;
	/** Handler for when the user mousedowns outside of the renferece and tooltip */
	onMouseDownOut?: () => void;
	/** Optional styles to be passed to the `div` wrapper around the reference element */
	style?: CSSProperties;
	/** Optional styles to be passed to the `div` wrapper around the popper element */
	popperStyle?: CSSProperties;
	/** The tooltip element to position based on direction and the reference element */
	tooltip?: ReactNode;
}

const isLocation = memoizeOne((value: any): value is ITooltipLocation => !isValidElement(value));

const mountToDocumentBody = (element: ReactElement) => createPortal(element, document.body);

export const Tooltip: FC<IProps> = ({
	active = false,
	children,
	className,
	direction: placement,
	onClickOut,
	onMouseDownOut,
	popperClassName,
	popperStyle,
	style,
	tooltip
}) => {
	const classes = useStyles({ active });

	const referenceRef = useRef<HTMLDivElement | null>(null);
	const popper = useRef<HTMLDivElement | null>(null);

	const reference = isLocation(children) ? children : referenceRef;

	const { update } = useTooltip({ reference, popper, placement });

	useIsomorphicLayoutEffect(() => {
		update();
	}, [active, update]);

	const mountStrategy: (element: ReactElement) => ReactElement = useMemo(() => {
		return isLocation(children) ? mountToDocumentBody : identity;
	}, [children]);

	return mountStrategy(
		<ClickOutside onClick={onClickOut} onMouseDown={onMouseDownOut}>
			<div className={classes.root}>
				{!isLocation(children) && (
					<div
						ref={referenceRef}
						className={classnames(classes.reference, className)}
						style={style}
					>
						{children}
					</div>
				)}
				<div
					ref={popper}
					className={classnames(classes.popper, popperClassName)}
					style={popperStyle}
				>
					{tooltip}
				</div>
			</div>
		</ClickOutside>
	);
};
