import { FormGroup, Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { ChangeEvent, FC, memo, ReactElement } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { Controller, useForm } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: ReturnType<typeof useForm>["control"];
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
			helperText={error}
			inline={inline}
			intent={intent}
			label={label}
		>
			<CountryDropdown
				classes={classes.countryDropdown}
				defaultOptionLabel={placeholder}
				onChange={onChange}
				value={value}
			/>
		</FormGroup>
	);
};

export const CountrySelect: FC<IProps> = memo((props) => {
	const { control, name, ...restProps } = props;

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
				onChange={([input]) => input || undefined}
			/>
		);
	}

	return <BaseCountrySelect {...props} />;
});

CountrySelect.displayName = "CountrySelect";
