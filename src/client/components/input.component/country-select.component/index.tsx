import { FormGroup } from "@/client/components/input.component/form-group.component";
import type { Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { ChangeEvent, FC, memo, ReactElement } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { Control, Controller } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: Control<any>;
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

const BaseCountrySelect: FC<IProps> = ({
	className,
	disabled,
	error,
	onChange = () => undefined,
	inline,
	label,
	placeholder,
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
			<CountryDropdown
				classes={classes.countryDropdown}
				defaultOptionLabel={placeholder}
				disabled={disabled}
				onChange={onChange}
				value={value}
				valueType="short"
			/>
		</FormGroup>
	);
};

export const CountrySelect: FC<IProps> = memo((props) => {
	const { control, name, defaultValue, onChange: _onChange, value: _value, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Country select is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				render={({ onChange, value }) => (
					<BaseCountrySelect
						{...restProps}
						onChange={(input) => {
							_onChange?.(input);
							onChange(input || undefined);
						}}
						value={value}
					/>
				)}
				defaultValue={defaultValue}
			/>
		);
	}

	return <BaseCountrySelect {...props} />;
});

CountrySelect.displayName = "CountrySelect";
