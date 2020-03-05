import React, { ReactNode } from "react";
import { SortableContainer } from "react-sortable-hoc";

interface IProps {
	children: ReactNode;
	className?: string;
}

export const SortableDataGridBody = SortableContainer<IProps>((props: IProps) => {
	const { children, className } = props;

	return <div className={className}>{children}</div>;
});
