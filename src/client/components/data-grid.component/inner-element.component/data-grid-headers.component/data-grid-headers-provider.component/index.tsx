import React, { FC, memo, ReactNode } from "react";
import { LabelEditProvider } from "./label-edit-provider.component";
import { ResizeProvider } from "./resize-provider.component";

export * from "./label-edit-provider.component";
export * from "./resize-provider.component";

interface IProps {
	children: ReactNode;
	resizeHandleClassName: string;
}

export const DataGridHeadersProvider: FC<IProps> = memo(({ children, resizeHandleClassName }) => {
	return (
		<ResizeProvider resizeHandleClassName={resizeHandleClassName}>
			<LabelEditProvider>{children}</LabelEditProvider>
		</ResizeProvider>
	);
});

DataGridHeadersProvider.displayName = "DataGridHeadersProvider";
