import { HeadersContext } from "@/client/components/data-grid.component";
import { useCallback, useContext } from "react";

export const useOnDelete = (index: number) => {
	const { removeHeaderItem } = useContext(HeadersContext);

	return useCallback(() => removeHeaderItem(index), [index, removeHeaderItem]);
};
