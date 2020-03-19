import { HeadersContext } from "@/client/components/data-grid.component";
import { useCallback, useContext, useMemo, useState } from "react";

interface IEditActionsStates {
	isEditing: boolean;
	value: string;
}

interface IEditActions {
	setValue: (value: string) => void;
	start: () => void;
	stop: () => void;
	updateLabel: () => void;
}

export const useEditActions = (index: number): [IEditActionsStates, IEditActions] => {
	const { headers, setHeaderLabel } = useContext(HeadersContext);

	const { label } = headers[index];

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [value, setValue] = useState<string>("");

	const updateLabel = useCallback(() => setHeaderLabel(value, index), [
		index,
		setHeaderLabel,
		value
	]);

	const stop = useCallback(() => {
		setValue(label);
		setIsEditing(false);
	}, [label, setIsEditing, setValue]);

	const start = useCallback(() => {
		setValue(label);
		setIsEditing(true);
	}, [label, setValue, setIsEditing]);

	return useMemo(
		() => [
			{ isEditing, value },
			{ setValue, start, stop, updateLabel }
		],
		[isEditing, setValue, start, stop, updateLabel, value]
	);
};
