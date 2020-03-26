import { IHeaderOption, Select } from "@/client/components";
import { Button } from "@blueprintjs/core";
import React, { FC, useMemo } from "react";

interface IProps {
	className?: string;
	columnOptions: readonly IHeaderOption[];
	onSelect: (item: IHeaderOption) => void;
}

const TypedSelect = Select.ofType<IHeaderOption & { key: string }>();

export const AddColumnSelect: FC<IProps> = ({ className, columnOptions, onSelect }) => {
	const asSelectItems = useMemo(() => {
		return columnOptions.map((option) => ({ ...option, key: option.value }));
	}, [columnOptions]);

	return (
		<TypedSelect
			className={className}
			items={asSelectItems}
			minimal={true}
			onItemSelect={onSelect}
			resetOnSelect={true}
		>
			<Button icon="plus" text="Add column" />
		</TypedSelect>
	);
};
