import { uniqueId } from "lodash-es";
import { useCallback, useMemo, useRef } from "react";

interface IOptions<T> {
	/** Specifies how the keys are made for each item. Uses a counter by default */
	id: (value: T) => string;
	/** Addes a prefix to created ids. Uses "" by default */
	prefix: string;
}

export const useDictionary = <T = any>(options?: Partial<IOptions<T>>) => {
	const finalOptions: IOptions<T> = {
		id: () => uniqueId(options?.prefix ?? ""),
		prefix: "",
		...options
	};

	const dictRef = useRef<Record<string, T>>({});

	const register = useCallback(
		(value: T): string => {
			const newId: string = finalOptions.id(value);

			dictRef.current = { ...dictRef.current, [newId]: value };

			return newId;
		},
		[finalOptions]
	);

	const unregister = useCallback((id: string): void => {
		const { [id]: toUnregister, ...dictWithoutId } = dictRef.current;

		dictRef.current = dictWithoutId;
	}, []);

	return useMemo(() => ({ dictRef, register, unregister }), [dictRef, register, unregister]);
};
