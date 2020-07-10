import { FormGroup } from "@/client/components/input.component/form-group.component";
import type { Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { ChangeEvent, FC, memo, ReactElement } from "react";
import { RegionDropdown } from "react-country-region-selector";
import { Control, Controller } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: Control<any>;
	country: string;
	defaultValue?: string;
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	name?: string;
	onChange?: (value: string, event?: ChangeEvent<Element>) => void;
	placeholder?: string;
	value?: string;
}

const BaseRegionSelect: FC<IProps> = ({
	className,
	disabled,
	error,
	inline,
	label,
	onChange = () => undefined,
	placeholder,
	country,
	value = ""
}) => {
	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	return (
		<FormGroup
			className={classnames(classes.root, className)}
			disabled={disabled}
			helperText={error}
			inline={inline}
			intent={intent}
			label={label}
		>
			<RegionDropdown
				classes={classes.regionDropdown}
				country={country}
				countryValueType="short"
				defaultOptionLabel={placeholder}
				disabled={disabled}
				onChange={onChange}
				value={value}
			/>
		</FormGroup>
	);
};

export const RegionSelect: FC<IProps> = memo((props) => {
	const { control, defaultValue, name, onChange: _onChange, value: _value, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Region select is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				render={({ onChange, value }) => (
					<BaseRegionSelect
						{...restProps}
						onChange={(input, event) => {
							_onChange?.(input, event);
							onChange(input || undefined);
						}}
						value={value}
					/>
				)}
				defaultValue={defaultValue}
			/>
		);
	}

	return <BaseRegionSelect {...props} />;
});

RegionSelect.displayName = "RegionSelect";
