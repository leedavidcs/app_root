import { useDictionary } from "@/client/hooks";
import { makeConcurrentFunc } from "@/client/utils";
import classnames from "classnames";
import React, {
	CSSProperties,
	FC,
	MouseEvent,
	MouseEventHandler,
	ReactNode,
	useCallback,
	useMemo
} from "react";
import { ClickOutsideContext, IHandlerInfo } from "./click-outside.context";
import { useStyles } from "./styles";

export * from "./click-outside.context";

interface IProps {
	children: ReactNode;
	className?: string;
	style?: CSSProperties;
}

/**
 * @description Creates a wrapper `div` that can be targetted as a global click event in place of
 *     `document`. The reason why `document` should not be used, is that it fails when detecting
 *     outside clicks on a ReactNode that contains a portal, since portals are detached from the
 *     native DOM element that we are binding the `onClickOut` listener to.
 *
 *     Portals still respect the React tree when it comes to event bubbling. This allows filtering
 *     which events to run by marking ReactNodes that have been clicked inside, before invoking the
 *     parent `onClick`.
 *
 *     `document` is problematic to add the `click` event listener to, because `document` listeners
 *     will always trigger before any React event handlers.
 * @see {@link https://reactjs.org/docs/portals.html#event-bubbling-through-portals} for
 *     information on React portals and event bubbling
 * @see {@link https://github.com/facebook/react/issues/7094#issuecomment-228931737} for
 *     Dan Abramov's explanation on event delegation.
 * @author David Lee
 * @date January 16, 2020
 */
export const ClickOutsideProvider: FC<IProps> = ({ children, className, style }) => {
	const classes = useStyles();

	const { dictRef, register, unregister } = useDictionary<IHandlerInfo>({
		prefix: "click_outside__"
	});

	const listener = useCallback(
		(type: IHandlerInfo["type"]) => {
			return (event: MouseEvent<HTMLDivElement>) => {
				const dict = dictRef.current;

				const handlers: readonly MouseEventHandler<HTMLDivElement>[] = Object.values(dict)
					.filter(({ type: infoType }) => infoType === type)
					.map(({ handler }) => handler);

				const concurrentFunc = makeConcurrentFunc(handlers);

				concurrentFunc(event);
			};
		},
		[dictRef]
	);

	const onClick = useCallback(listener("click"), [listener]);
	const onMouseDown = useCallback(listener("mousedown"), [listener]);
	const onMouseUp = useCallback(listener("mouseup"), [listener]);

	const value = useMemo(() => ({ register, unregister }), [register, unregister]);

	return (
		<ClickOutsideContext.Provider value={value}>
			<div
				className={classnames(classes.root, className)}
				onClick={onClick}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				style={style}
			>
				{children}
			</div>
		</ClickOutsideContext.Provider>
	);
};
