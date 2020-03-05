import { HeadersContext } from "@/client/components/data-grid.component";
import { useCallback, useContext, useMemo, useState } from "react";

export const useEditActions = (index: number) => {
	const { headers, setHeaderLabel } = useContext(HeadersContext);

	const { label } = headers[index];

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [value, setValue] = useState<string>("");

	const updateLabel = useCallback(() => setHeaderLabel(value, index), [
		index,
		setHeaderLabel,
		value
	]);

	const stopEditing = useCallback(() => {
		setValue(label);
		setIsEditing(false);
	}, [label, setIsEditing, setValue]);

	const startEditing = useCallback(() => {
		setValue(label);
		setIsEditing(true);
	}, [label, setValue, setIsEditing]);

	return useMemo(
		() => ({
			inputValue: value,
			isEditing,
			setInputValue: setValue,
			startEditing,
			stopEditing,
			updateLabel
		}),
		[isEditing, setValue, startEditing, stopEditing, updateLabel, value]
	);
};
