import { Overlay } from "@/client/components/overlay.component";
import { useHover, usePressed, useRenderCount } from "@/client/hooks";
import type { Elevation } from "@blueprintjs/core";
import { Card as BpCard } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, MouseEvent, ReactNode } from "react";
import { useStyles } from "./styles";

interface IProps {
	children: ReactNode;
	className?: string;
	elevation?: Elevation;
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
	title?: ReactNode;
}

const elevationToOpacityMap: Record<Elevation, number> = {
	0: 0,
	1: 0.05,
	2: 0.08,
	3: 0.11,
	4: 0.14
};

const HOVER_OPACITY = 0.04;
const PRESS_OPACITY = 0.1;

export const Card: FC<IProps> = ({ children, className, elevation = 0, onClick, title }) => {
	const classes = useStyles();

	const renderCount = useRenderCount();

	const [isPressed, pressedResult] = usePressed(false);
	const [isHovered, hoverResult] = useHover(false);

	const interactive = Boolean(onClick);

	const overlayOpacity: number = !interactive
		? elevationToOpacityMap[elevation]
		: isPressed
		? PRESS_OPACITY
		: isHovered
		? HOVER_OPACITY
		: elevationToOpacityMap[elevation];

	return (
		<BpCard
			className={classnames(classes.root, className)}
			elevation={elevation}
			interactive={interactive}
			onClick={onClick}
			{...pressedResult.handlers}
			{...hoverResult.handlers}
		>
			{title && <div className={classes.title}>{title}</div>}
			{children}
			<Overlay
				active={true}
				animate={renderCount !== 0}
				clickThrough={true}
				opacity={overlayOpacity}
			/>
		</BpCard>
	);
};
