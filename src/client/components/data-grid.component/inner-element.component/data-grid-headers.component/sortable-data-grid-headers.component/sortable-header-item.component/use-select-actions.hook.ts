import {
	HeadersContext,
	IHeaderOption,
	ResizeContext
} from "@/client/components/data-grid.component";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

export const useSelectActions = (index: number) => {
	const { isResizing } = useContext(ResizeContext);
	const { setHeaderOption } = useContext(HeadersContext);

	const [isSelected, setIsSelected] = useState<boolean>(false);

	const closeSelect = useCallback(() => setIsSelected(false), [setIsSelected]);

	const openSelect = useCallback(() => {
		// Should not open select when resizing
		if (isResizing) {
			return;
		}

		setIsSelected(true);
	}, [isResizing, setIsSelected]);

	const selectOption = useCallback((option: IHeaderOption) => setHeaderOption(option, index), [
		index,
		setHeaderOption
	]);

	// Unselect when resizing
	useEffect(() => setIsSelected(!isResizing && isSelected), [isResizing, isSelected]);

	return useMemo(() => ({ closeSelect, isSelected, openSelect, selectOption }), [
		closeSelect,
		openSelect,
		isSelected,
		selectOption
	]);
};
