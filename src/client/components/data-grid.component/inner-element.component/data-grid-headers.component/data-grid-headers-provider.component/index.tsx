import React, { FC, memo, ReactNode } from "react";
import { ResizeProvider } from "./resize-provider.component";

export * from "./resize-provider.component";

interface IProps {
	children: ReactNode;
	resizeHandleClassName: string;
}

export const DataGridHeadersProvider: FC<IProps> = memo(({ children, resizeHandleClassName }) => {
	return (
		<ResizeProvider resizeHandleClassName={resizeHandleClassName}>{children}</ResizeProvider>
	);
});

DataGridHeadersProvider.displayName = "DataGridHeadersProvider";
