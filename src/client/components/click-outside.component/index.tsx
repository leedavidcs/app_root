import React, {
	Children,
	cloneElement,
	FC,
	MouseEvent,
	MouseEventHandler,
	ReactElement,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef
} from "react";
import { ClickOutsideContext, IHandlerInfo } from "./click-outside-provider.component";

export * from "./click-outside-provider.component";

interface IProps {
	/**
	 * Children must be an HTMLElement, so that onClickCapture can be provided. Typescript does not
	 * validate that the Children of ClickOutside has valid props when it is used.
	 */
	children: ReactElement;
	/** Function to be invoked when the ReactNode is clicked outside of */
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
	/** Function to be invoked when the ReactNode is mouse pressed outside of */
	onMouseDown?: (event: MouseEvent<HTMLDivElement>) => void;
	/** Function to be invoked when the ReactNode has had a mouse released outside of */
	onMouseUp?: (event: MouseEvent<HTMLDivElement>) => void;
}

type DidClickInside = Record<keyof Omit<IProps, "children">, boolean>;

export const ClickOutside: FC<IProps> = ({ children, onClick, onMouseDown, onMouseUp }) => {
	const didClickInside = useRef<DidClickInside>({
		onClick: false,
		onMouseDown: false,
		onMouseUp: false
	});

	const { register, unregister } = useContext(ClickOutsideContext);

	const withDiv = Children.only(children).type === "div" ? children : <div>{children}</div>;

	const capture = useCallback(
		(type: keyof Omit<IProps, "children">) => {
			return (event: MouseEvent<HTMLDivElement>) => {
				didClickInside.current = { ...didClickInside.current, [type]: true };

				withDiv.props[type]?.(event);
			};
		},
		[withDiv]
	);

	const out = useCallback(
		(type: keyof Omit<IProps, "children">, handler?: MouseEventHandler<HTMLDivElement>) => {
			return (event: MouseEvent<HTMLDivElement>) => {
				if (didClickInside.current[type]) {
					didClickInside.current = { ...didClickInside.current, [type]: false };

					return;
				}

				handler?.(event);
			};
		},
		[]
	);

	const createRegistrationEffect = useCallback(
		(type: IHandlerInfo["type"], handler?: MouseEventHandler<HTMLDivElement>) => {
			if (!handler) {
				return;
			}

			const eventId: string = register({ type, handler });

			return () => unregister(eventId);
		},
		[register, unregister]
	);

	const onClickCapture = useCallback(capture("onClick"), [capture]);
	const onMouseDownCapture = useCallback(capture("onMouseDown"), [capture]);
	const onMouseUpCapture = useCallback(capture("onMouseUp"), [capture]);

	const onClickOut = useMemo(() => onClick && out("onClick", onClick), [onClick, out]);
	const onMouseDownOut = useMemo(() => onMouseDown && out("onMouseDown", onMouseDown), [
		onMouseDown,
		out
	]);
	const onMouseUpOut = useMemo(() => onMouseUp && out("onMouseUp", onMouseUp), [onMouseUp, out]);

	useEffect(() => createRegistrationEffect("click", onClickOut), [
		onClickOut,
		createRegistrationEffect
	]);
	useEffect(() => createRegistrationEffect("mousedown", onMouseDownOut), [
		onMouseDownOut,
		createRegistrationEffect
	]);
	useEffect(() => createRegistrationEffect("mouseup", onMouseUpOut), [
		onMouseUpOut,
		createRegistrationEffect
	]);

	return cloneElement(withDiv, {
		onClickCapture,
		onMouseDownCapture,
		onMouseUpCapture
	});
};
