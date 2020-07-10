import { MutableRefObject, RefObject, useEffect, useRef, useState } from "react";

/**
 * @description Use this hook to check if the component is the last child of its parent
 * @param ref - Ref of the root element of the element to check if this element is the last child
 * @author David Lee
 * @date January 23, 2020
 */
export const useIsLastChild = <T extends Element>(ref?: MutableRefObject<T | null>) => {
	const [isLastChild, setIsLastChild] = useState<boolean>(false);

	const createdRef: RefObject<T> = useRef<T>(null);
	const finalRef: MutableRefObject<T | null> = ref || createdRef;

	useEffect(() => setIsLastChild(!finalRef.current?.nextElementSibling), [finalRef]);

	return [isLastChild, finalRef];
};
