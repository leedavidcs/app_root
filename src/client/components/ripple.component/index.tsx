import { useClickThrough } from "@/client/hooks";
import { debounce } from "lodash";
import React, { CSSProperties, FC, useCallback, useEffect, useRef, useState } from "react";
import { useStyles } from "./styles";

const CLEAN_UP_DEBOUNCE = 2000;

export const Ripple: FC = () => {
	const classes = useStyles();

	const [styles, setStyles] = useState<{ [key: string]: CSSProperties }>({});
	const [count, setCount] = useState<number>(0);
	const elemRef = useRef<HTMLDivElement | null>(null);

	const onMouseDown = useCallback(
		(event: MouseEvent) => {
			const container = event.relatedTarget as HTMLDivElement;

			const size = container.offsetWidth;
			const position = container.getBoundingClientRect();

			const x = event.pageX - position.x - size / 2;
			const y = event.pageY - position.y - size / 2;

			const rippleStyle: CSSProperties = {
				top: y,
				left: x,
				height: size,
				width: size
			};

			setStyles({ ...styles, [count]: rippleStyle });
			setCount(count + 1);
		},
		[styles, setStyles, count, setCount]
	);

	const onMouseUp = useCallback(
		debounce(() => {
			setStyles({});
			setCount(0);
		}, CLEAN_UP_DEBOUNCE),
		[setStyles, setCount]
	);

	useClickThrough(onMouseDown, elemRef, { event: "mousedown" });
	useClickThrough(onMouseUp, elemRef, { event: "mouseup" });

	useEffect(() => () => onMouseUp.cancel(), [onMouseUp]);

	return (
		<div ref={elemRef} className={classes.root}>
			{Object.keys(styles).map((key) => (
				<span className={classes.ripple} key={key} style={styles[key]} />
			))}
		</div>
	);
};
