import { MutableRefObject, useEffect, useRef, useState } from "react";

export const useModule = <T extends { default: any }>(
	importer: () => Promise<T>
): T | undefined => {
	const importerRef: MutableRefObject<() => Promise<T>> = useRef(importer);

	const [mod, setMod] = useState<T>();

	useEffect(() => {
		importerRef.current().then((imported) => {
			setMod(imported);
		});
	}, []);

	return mod;
};
