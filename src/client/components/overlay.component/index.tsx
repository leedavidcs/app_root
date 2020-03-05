import { useIsomorphicLayoutEffect } from "@/client/hooks";
import { toggleClass } from "@/client/utils";
import classnames from "classnames";
import React, { FC, memo, useEffect, useRef } from "react";
import { useStyles } from "./styles";

const DEFAULT_OPACITY = 0.6;
const DEFAULT_TRANSITION_MS = 400;

interface IProps {
	/** Whether this overlay is on or not */
	active?: boolean;
	/** Whether animations should be turned on */
	animate?: boolean;
	/** Optional classes to place on the div used for this overlay */
	className?: string;
	/** If true, pointer-events will be off for this element */
	clickThrough?: boolean;
	/**
	 * The opacity for this element when active
	 *
	 * @default 0.6
	 */
	opacity?: number;
	/**
	 * If true, this element is absolutely positioned to its nearest relative parent. Otherwise it
	 * is fixed
	 */
	relative?: boolean;
	/**
	 * If {animate} is true, this sets the transition duration in milliseconds
	 *
	 * @default 400
	 */
	transition?: number;
}

export const Overlay: FC<IProps> = memo(
	({
		active = false,
		animate = true,
		className,
		clickThrough = false,
		opacity = DEFAULT_OPACITY,
		relative = true,
		transition = DEFAULT_TRANSITION_MS
	}) => {
		const classes = useStyles({ active, animate, clickThrough, opacity, relative, transition });
		const elemRef = useRef<HTMLDivElement>(null);

		useIsomorphicLayoutEffect(() => {
			const elem: HTMLDivElement | null = elemRef.current;

			if (!elem) {
				return;
			}

			toggleClass(elem, classes.active, true);
		}, [active, classes.active]);

		useEffect(() => {
			const elem: HTMLDivElement | null = elemRef.current;

			if (!elem) {
				return;
			}

			setTimeout(() => toggleClass(elem, classes.transition, true), transition);
		}, [animate, transition, classes.transition]);

		return <div className={classnames(classes.root, className)} ref={elemRef} />;
	}
);

Overlay.displayName = "Overlay";
