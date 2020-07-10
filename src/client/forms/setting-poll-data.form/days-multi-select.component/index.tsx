import { FormMultiSelect } from "@/client/components";
import { Day } from "@/client/graphql";
import React, { FC, ReactElement, useCallback } from "react";
import { Control } from "react-hook-form";

interface IProps {
	control: Control<any>;
	defaultValue?: readonly Day[];
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	name: string;
	queryPlaceholder?: string;
}

interface IDayItem {
	value: Day;
	label: string;
}

const TypedFormMultiSelect = FormMultiSelect.ofType<Day, IDayItem>();

const mapDayToText = (item: Day): string => {
	switch (item) {
		case Day.Mon:
			return "Monday";
		case Day.Tues:
			return "Tuesday";
		case Day.Wed:
			return "Wednesday";
		case Day.Thurs:
			return "Thursday";
		case Day.Fri:
			return "Friday";
		case Day.Sat:
			return "Saturday";
		case Day.Sun:
			return "Sunday";
	}
};

const items: readonly IDayItem[] = [
	Day.Mon,
	Day.Tues,
	Day.Wed,
	Day.Thurs,
	Day.Fri,
	Day.Sat,
	Day.Sun
].map((day) => ({
	value: day,
	label: mapDayToText(day)
}));

const itemMap = {
	from: (item: IDayItem): Day => item.value,
	to: (item: Day): IDayItem => ({
		value: item,
		label: mapDayToText(item)
	})
};

const itemKey = (item: IDayItem) => item.value;
const itemName = (item: IDayItem) => item.label;

export const DaysMultiSelect: FC<IProps> = ({
	control,
	defaultValue,
	disabled,
	error,
	inline,
	label,
	name,
	queryPlaceholder
}) => {
	const transform = useCallback((days: readonly Day[]) => {
		return items
			.filter(({ value }) => days.some((day) => day === value))
			.map(({ value }) => value);
	}, []);

	return (
		<TypedFormMultiSelect
			control={control}
			defaultValue={defaultValue}
			disabled={disabled}
			error={error}
			inline={inline}
			itemKey={itemKey}
			itemMap={itemMap}
			itemName={itemName}
			items={items}
			label={label}
			minimal={true}
			name={name}
			queryPlaceholder={queryPlaceholder}
			transform={transform}
			usePortal={false}
		/>
	);
};
