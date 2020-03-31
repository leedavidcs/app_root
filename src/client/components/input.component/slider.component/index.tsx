import { FormGroup, Intent, NumericInput, Slider as BpSlider } from "@blueprintjs/core";
import classnames from "classnames";
import React, { CSSProperties, FC, KeyboardEvent, ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: ReturnType<typeof useForm>["control"];
	disabled?: boolean;
	error?: Maybe<string> | ReactElement;
	label?: string;
	labelInfo?: string;
	labelPrecision?: number;
	labelStepSize?: number;
	max?: number;
	min?: number;
	name?: string;
	onChange?: (value: number) => void;
	onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
	placeholder?: string;
	stepSize?: number;
	style?: CSSProperties;
	value?: number;
	withInput?: boolean;
}

export const BaseSlider: FC<IProps> = (props) => {
	const {
		className,
		control,
		disabled,
		error,
		label,
		labelInfo,
		labelPrecision,
		labelStepSize,
		max,
		min,
		onChange,
		onKeyDown,
		placeholder,
		stepSize,
		style,
		value,
		withInput
	} = props;

	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	const isControlled: boolean = Boolean(onChange) || Boolean(control);

	if (!isControlled) {
		throw new Error("Slider must define onChange or control.");
	}

	return (
		<FormGroup
			className={classnames(classes.root, className)}
			disabled={disabled}
			helperText={error}
			intent={intent}
			label={label}
			labelInfo={labelInfo}
			style={style}
		>
			{withInput && (
				<NumericInput
					allowNumericCharactersOnly={true}
					clampValueOnBlur={true}
					disabled={disabled}
					fill={true}
					intent={intent}
					max={max}
					min={min}
					onKeyDown={onKeyDown}
					onValueChange={onChange}
					placeholder={placeholder}
					stepSize={stepSize}
					value={value}
				/>
			)}
			<BpSlider
				disabled={disabled}
				labelPrecision={labelPrecision}
				labelStepSize={labelStepSize}
				intent={intent}
				max={max}
				min={min}
				stepSize={stepSize}
				onChange={onChange}
				value={value}
			/>
		</FormGroup>
	);
};

export const Slider: FC<IProps> = (props) => {
	const { control, name, value, onChange, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Slider is used in a form without a name!");
		}

		return (
			<Controller
				as={BaseSlider}
				control={control}
				name={name}
				{...restProps}
				defaultValue={0}
				onChange={([input]) => input}
			/>
		);
	}

	return <BaseSlider {...props} />;
};
