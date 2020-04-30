import { FormSelect } from "@/client/components";
import { Recurrence } from "@/client/graphql";
import React, { FC, ReactElement } from "react";
import { Control } from "react-hook-form";

interface IProps {
	className?: string;
	control: Control<any>;
	defaultValue?: Recurrence;
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	name: string;
	placeholder?: string;
}

const items: readonly Recurrence[] = [Recurrence.Once, Recurrence.Daily, Recurrence.Weekly];

const TypedFormSelect = FormSelect.ofType<Recurrence>();

const itemName = (recurrence: Recurrence) => recurrence;
const itemKey = (recurrence: Recurrence) => recurrence;
const itemMap = {
	from: (recurrence: Recurrence) => recurrence,
	to: (recurrence: Recurrence) => recurrence
};

export const RecurrenceSelect: FC<IProps> = ({
	className,
	control,
	defaultValue,
	disabled,
	error,
	inline,
	label,
	name,
	placeholder
}) => {
	return (
		<TypedFormSelect
			className={className}
			control={control}
			defaultValue={defaultValue}
			disabled={disabled}
			error={error}
			filterable={false}
			inline={inline}
			itemKey={itemKey}
			itemMap={itemMap}
			itemName={itemName}
			items={items}
			label={label}
			minimal={true}
			name={name}
			placeholder={placeholder}
		/>
	);
};
