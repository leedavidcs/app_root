import { HeadersContext } from "@/client/components/data-grid.component";
import { useCallback, useContext, useMemo } from "react";

export const useFreezeActions = (index: number) => {
	const { headers, setHeaderFreeze } = useContext(HeadersContext);

	const { frozen } = headers[index];

	const freezeActionLabel: string = frozen ? "Unfreeze" : "Freeze";

	const freezeAction: () => void = useCallback(() => setHeaderFreeze(!frozen, index), [
		frozen,
		index,
		setHeaderFreeze
	]);

	return useMemo(
		() => ({
			freezeAction,
			freezeActionLabel
		}),
		[freezeAction, freezeActionLabel]
	);
};
