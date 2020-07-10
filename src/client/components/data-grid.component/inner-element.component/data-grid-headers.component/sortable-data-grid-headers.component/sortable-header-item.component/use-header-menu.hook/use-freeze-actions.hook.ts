import { HeadersContext } from "@/client/components/data-grid.component";
import { useCallback, useContext, useMemo } from "react";

interface IFreezeActions {
	freeze: () => void;
}

export const useFreezeActions = (index: number): [string, IFreezeActions] => {
	const { headers, setHeaderFreeze } = useContext(HeadersContext);

	const { frozen } = headers[index];

	const label: string = frozen ? "Unfreeze" : "Freeze";

	const freeze = useCallback(() => setHeaderFreeze(!frozen, index), [
		frozen,
		index,
		setHeaderFreeze
	]);

	return useMemo(() => [label, { freeze }], [freeze, label]);
};
