import {
	HeadersContext,
	IHeaderOption,
	ResizeContext
} from "@/client/components/data-grid.component";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

interface ISelectActions {
	open: () => void;
	close: () => void;
	select: (option: IHeaderOption) => void;
}

export const useSelectActions = (index: number): [boolean, ISelectActions] => {
	const { isResizing } = useContext(ResizeContext);
	const { setHeaderOption } = useContext(HeadersContext);

	const [isSelected, setIsSelected] = useState<boolean>(false);

	const close = useCallback(() => setIsSelected(false), [setIsSelected]);

	const open = useCallback(() => {
		// Should not open select when resizing
		if (isResizing) {
			return;
		}

		setIsSelected(true);
	}, [isResizing, setIsSelected]);

	const select = useCallback((option: IHeaderOption) => setHeaderOption(option, index), [
		index,
		setHeaderOption
	]);

	// Unselect when resizing
	useEffect(() => setIsSelected(!isResizing && isSelected), [isResizing, isSelected]);

	return useMemo(() => [isSelected, { close, open, select }], [close, open, isSelected, select]);
};
