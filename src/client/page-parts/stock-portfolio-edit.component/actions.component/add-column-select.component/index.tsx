import { IHeaderOption, Select } from "@/client/components";
import { Button } from "@blueprintjs/core";
import React, { FC, useCallback, useMemo } from "react";

interface IProps {
	className?: string;
	columnOptions: readonly IHeaderOption[];
	onSelect: (item: IHeaderOption) => void;
}

const TypedSelect = Select.ofType<IHeaderOption>();

export const AddColumnSelect: FC<IProps> = ({ className, columnOptions, onSelect }) => {
	const asSelectItems = useMemo(() => {
		return columnOptions.map((option) => ({ ...option, key: option.label }));
	}, [columnOptions]);

	const itemKey = useCallback(({ label }: IHeaderOption) => label, []);
	const itemName = itemKey;

	return (
		<TypedSelect
			className={className}
			itemKey={itemKey}
			itemName={itemName}
			items={asSelectItems}
			minimal={true}
			onItemSelect={onSelect}
			resetOnSelect={true}
		>
			<Button icon="plus" text="Add column" />
		</TypedSelect>
	);
};
