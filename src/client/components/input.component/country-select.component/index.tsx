import { FormGroup, Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { ChangeEvent, FC, memo, ReactElement } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { Control, Controller } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: Control<any>;
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
	const { control, name, onChange, value, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Country select is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				as={BaseCountrySelect}
				name={name}
				{...restProps}
				defaultValue={undefined}
				onChange={([input]) => {
					const result = input || undefined;

					onChange?.(result);

					return result;
				}}
			/>
		);
	}

	return <BaseCountrySelect {...props} />;
});

CountrySelect.displayName = "CountrySelect";
