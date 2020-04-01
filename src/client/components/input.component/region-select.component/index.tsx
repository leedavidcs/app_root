import { FormGroup, Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { ChangeEvent, FC, memo, ReactElement } from "react";
import { RegionDropdown } from "react-country-region-selector";
import { Controller, useForm } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: ReturnType<typeof useForm>["control"];
	country: string;
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	name?: string;
	onChange?: (value: string, event?: ChangeEvent<Element>) => void;
	value?: string;
}

const BaseRegionSelect: FC<IProps> = ({
	className,
	disabled,
	error,
	inline,
	label,
	onChange = () => undefined,
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
				disabled={disabled}
				onChange={onChange}
				value={value}
			/>
		</FormGroup>
	);
};

export const RegionSelect: FC<IProps> = memo((props) => {
	const { control, name, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Region select is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				as={BaseRegionSelect}
				name={name}
				{...restProps}
				defaultValue={undefined}
				onChange={([input]) => input || undefined}
			/>
		);
	}

	return <BaseRegionSelect {...props} />;
});

RegionSelect.displayName = "RegionSelect";
