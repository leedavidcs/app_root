import React, { FC, memo, ReactNode } from "react";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import { AutoSizerContext } from "./auto-sizer.context";
import { useStyles } from "./styles";

export * from "./auto-sizer.context";

interface IProps {
	children: (size: Size) => ReactNode;
}

export const AutoSizerProvider: FC<IProps> = memo(({ children }) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<AutoSizer>
				{(size: Size) => (
					<AutoSizerContext.Provider value={size}>
						{children(size)}
					</AutoSizerContext.Provider>
				)}
			</AutoSizer>
		</div>
	);
});

AutoSizerProvider.displayName = "AutoSizerProvider";
