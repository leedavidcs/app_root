import { Tooltip } from "@/client/components/tooltip.component";
import { ITooltipLocation, useGlobalHotkey } from "@/client/hooks";
import { codes } from "keycode";
import React, {
	forwardRef,
	Fragment,
	MouseEvent,
	ReactElement,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from "react";
import { ContextMenuContext } from "./context-menu-provider.component";
import { useStyles } from "./styles";

export * from "./context-menu-provider.component";

interface IProps {
	/** Element that will be the bounding box for right click events */
	children: ReactElement;
	/** The component to render at location. This does not necessarily need to be a menu */
	menu: ReactNode;
	/**
	 * Invoked when the context menu is closed
	 *
	 * @default () => undefined
	 */
	onClose?: () => void;
	/**
	 * Invoked when the context menu is opened
	 *
	 * @default () => undefined
	 */
	onOpen?: () => void;
	/**
	 * If true, will prevent other ContextMenus from opening when this one is open, under the
	 * nearest ancestor ContextMenuProvider. Otherwise, will disregard other ContextMenus.
	 *
	 * @default true
	 */
	register?: boolean;
}

interface IRef {
	id: string;
}

export const ContextMenu = forwardRef<IRef, IProps>(
	(
		{
			children,
			menu,
			onClose = () => undefined,
			onOpen = () => undefined,
			register: propsRegister = true
		},
		ref
	) => {
		const classes = useStyles();

		const { close: ctxClose, open: ctxOpen, register, unregister } = useContext(
			ContextMenuContext
		);

		const [location, setLocation] = useState<ITooltipLocation | null>(null);

		const idRef = useRef<string>("");

		useImperativeHandle(ref, () => ({ id: idRef.current }));

		const open = useCallback(
			(newLocation: ITooltipLocation) => {
				setLocation((prevLocation) => {
					if (!prevLocation) {
						onOpen();
					}

					return newLocation;
				});
			},
			[onOpen, setLocation]
		);

		const close = useCallback(() => {
			setLocation((prevLocation) => {
				if (prevLocation) {
					onClose();
				}

				return null;
			});
		}, [onClose, setLocation]);

		const onContextMenu = useCallback(
			(event: MouseEvent<HTMLDivElement>) => {
				event.preventDefault();

				const { clientX, clientY } = event;

				const eventLocation: ITooltipLocation = { x: clientX, y: clientY };

				propsRegister ? ctxOpen(idRef.current, eventLocation) : open(eventLocation);
			},
			[propsRegister, open, ctxOpen]
		);

		const closeHandler = useCallback(() => {
			return propsRegister ? ctxClose(idRef.current) : close();
		}, [propsRegister, close, ctxClose]);

		useEffect(() => {
			if (!propsRegister) {
				return;
			}

			idRef.current = register({ close, open });

			return () => unregister(idRef.current);
		}, [close, open, propsRegister, register, unregister]);

		useGlobalHotkey(
			{
				disabled: propsRegister,
				keyCode: codes.esc
			},
			closeHandler
		);

		return (
			<Fragment>
				<div className={classes.root} onContextMenu={onContextMenu}>
					{children}
				</div>
				{location && (
					<Tooltip
						active={true}
						direction="bottom-start"
						onMouseDownOut={closeHandler}
						tooltip={<div onClick={closeHandler}>{menu}</div>}
					>
						{location}
					</Tooltip>
				)}
			</Fragment>
		);
	}
);
