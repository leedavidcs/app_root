import React, { FC, memo, ReactNode, useMemo, useState } from "react";
import { LabelEditContext } from "./label-edit.context";

export * from "./label-edit.context";

interface IProps {
	children: ReactNode;
}

export const LabelEditProvider: FC<IProps> = memo(({ children }) => {
	const [editing, setEditing] = useState<number | null>(null);

	const value = useMemo(() => ({ editing, setEditing }), [editing, setEditing]);

	return <LabelEditContext.Provider value={value}>{children}</LabelEditContext.Provider>;
});

LabelEditProvider.displayName = "LabelEditProvider";
