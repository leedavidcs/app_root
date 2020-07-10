import { useIsomorphicLayoutEffect } from "@/client/hooks";
import { toggleClass } from "@/client/utils";
import classnames from "classnames";
import React, {
	FC,
	ReactElement,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState
} from "react";
import { useStyles } from "./styles";

const DEFAULT_TRANSITION_MS = 200;

interface IProps {
	/** Open/close state of the drawer (children) */
	active: boolean;
	/** Whether the drawer should transition between {active} states */
	animate?: boolean;
	/** The element to use as the header (top) for the contents */
	header: ReactElement;
	/** Contents that are shown/hidden depending on {active} */
	children: ReactNode;
	/** Optional classes to pass to the outer div of this component */
	className?: string;
	/** Listener for when the header is clicked on, passing the current {active} state */
	onClick?: (active: boolean) => void;
	/**
	 * If {animate} is true, this sets the transition duration in milliseconds
	 *
	 * @default 200
	 */
	transition?: number;
}

export const ExpansionPanel: FC<IProps> = ({
	active,
	animate = true,
	header,
	children,
	className,
	onClick: propsOnClick,
	transition = DEFAULT_TRANSITION_MS
}) => {
	const [height, setHeight] = useState<number>(0);

	const classes = useStyles({ active, height, transition });

	const containerRef = useRef<HTMLDivElement | null>(null);

	// Add expansion class to container before render
	useIsomorphicLayoutEffect(() => {
		const containerElem: HTMLDivElement | null = containerRef.current;

		if (!containerElem) {
			return;
		}

		toggleClass(containerElem, classes.expansion, true);
	}, [active, classes.expansion]);

	// Add transition after initial render
	useEffect(() => {
		const containerElem: HTMLDivElement | null = containerRef.current;

		if (!containerElem) {
			return;
		}

		setTimeout(() => toggleClass(containerElem, classes.transition, animate), transition);
	}, [animate, height, transition, classes.transition]);

	// Compute content height for expansion
	useEffect(() => {
		const contentElem = containerRef.current?.firstElementChild;

		if (!contentElem) {
			return;
		}

		const contentHeight: number = contentElem.clientHeight;

		setHeight(contentHeight);
	}, [setHeight]);

	const onClick = useCallback(() => propsOnClick?.(active), [active, propsOnClick]);

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.header} onClick={onClick}>
				{header}
			</div>
			<div ref={containerRef} className={classes.content}>
				{children}
			</div>
		</div>
	);
};
