import React, { FC, memo, ReactNode, useMemo, useState } from "react";
import { ScrollContext } from "./scroll.context";

export * from "./scroll.context";

interface IProps {
	children: ReactNode;
}

export const ScrollProvider: FC<IProps> = memo(({ children }) => {
	const [xOffset, setXOffset] = useState<number>(0);
	const [yOffset, setYOffset] = useState<number>(0);

	const value = useMemo(
		() => ({
			onHorizontalScroll: setXOffset,
			onVerticalScroll: setYOffset,
			xOffset,
			yOffset
		}),
		[setXOffset, setYOffset, xOffset, yOffset]
	);

	return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
});

ScrollProvider.displayName = "ScrollProvider";
