import { ITooltipLocation, useDictionary, useGlobalHotkey } from "@/client/hooks";
import { makeConcurrentFunc } from "@/client/utils";
import { codes } from "keycode";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { ContextMenuContext, IContextMenuRegisterHandlers } from "./context-menu.context";

export * from "./context-menu.context";

interface IProps {
	children: ReactNode;
}

export const ContextMenuProvider: FC<IProps> = ({ children }) => {
	const { dictRef, register, unregister } = useDictionary<IContextMenuRegisterHandlers>({
		prefix: "context_menu__"
	});

	const close = useCallback(
		(id?: string) => {
			const dict = dictRef.current;

			if (id) {
				return dict[id]?.close();
			}

			const funcs: readonly (() => void)[] = Object.values(dict).map(({ close: f }) => f);

			const closeAll = makeConcurrentFunc(funcs);

			closeAll();
		},
		[dictRef]
	);

	const open = useCallback(
		(id: string, location: ITooltipLocation) => {
			const { [id]: toOpen, ...toClose } = dictRef.current;

			const funcs: readonly (() => void)[] = Object.values(toClose).map(({ close: f }) => f);

			const closeOthers = makeConcurrentFunc(funcs);

			closeOthers();
			toOpen?.open(location);
		},
		[dictRef]
	);

	useGlobalHotkey(codes.esc, () => close());

	const value = useMemo(() => ({ close, open, register, unregister }), [
		close,
		open,
		register,
		unregister
	]);

	return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>;
};
