import { useCallback, useEffect, useMemo } from "react";

interface IOptionalOptions {
	disabled: boolean;
}

interface IRequiredOptions {
	keyCode: number;
}

interface IOptions extends IRequiredOptions, Partial<IOptionalOptions> {}

export const useGlobalHotkey = (options: number | IOptions, handler: () => void) => {
	const finalOptions: IOptionalOptions & IRequiredOptions = useMemo(
		() => ({
			disabled: false,
			...(typeof options === "number" ? { keyCode: options } : options)
		}),
		[options]
	);

	const onKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const { keyCode } = finalOptions;

			if (event.keyCode !== keyCode) {
				return;
			}

			handler();
		},
		[finalOptions, handler]
	);

	useEffect(() => {
		const { disabled } = finalOptions;

		if (disabled) {
			return;
		}

		document.addEventListener("keydown", onKeyDown);

		return () => document.removeEventListener("keydown", onKeyDown);
	}, [finalOptions, onKeyDown]);
};
