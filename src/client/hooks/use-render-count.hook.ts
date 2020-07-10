import { useEffect, useRef } from "react";

export const useRenderCount = (): number => {
	const renderCountRef = useRef<number>(0);

	useEffect(() => {
		renderCountRef.current += 1;
	});

	return renderCountRef.current;
};
