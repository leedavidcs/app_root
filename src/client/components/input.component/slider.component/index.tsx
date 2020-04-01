import { FormGroup, Intent, NumericInput, Slider as BpSlider } from "@blueprintjs/core";
import { countDecimalPlaces } from "@blueprintjs/core/lib/esm/common/utils";
import classnames from "classnames";
import { round } from "lodash";
import React, { CSSProperties, FC, KeyboardEvent, ReactElement, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: ReturnType<typeof useForm>["control"];
	disabled?: boolean;
	error?: Maybe<string> | ReactElement;
	inline?: boolean;
	label?: string;
	labelInfo?: string;
	labelPrecision?: number;
	labelStepSize?: number;
	majorStepSize?: number;
	minorStepSize?: number;
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

const BaseSlider: FC<IProps> = (props) => {
	const {
		className,
		disabled,
		error,
		inline,
		label,
		labelInfo,
		labelPrecision,
		labelStepSize,
		majorStepSize,
		minorStepSize,
		max,
		min,
		onChange: _onChange,
		onKeyDown,
		placeholder,
		stepSize = 1,
		style,
		value,
		withInput
	} = props;

	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	const getRoundedValue = useCallback(
		(input: number) => round(input, countDecimalPlaces(labelPrecision || stepSize)),
		[labelPrecision, stepSize]
	);

	const onChange = useCallback((input: number) => _onChange?.(getRoundedValue(input)), [
		_onChange,
		getRoundedValue
	]);

	return (
		<FormGroup
			className={classnames(classes.root, { [classes.inline]: inline }, className)}
			disabled={disabled}
			helperText={error}
			inline={inline}
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
					majorStepSize={majorStepSize ?? stepSize}
					minorStepSize={minorStepSize ?? stepSize}
					max={max}
					min={min}
					onKeyDown={onKeyDown}
					onValueChange={onChange}
					placeholder={placeholder}
					stepSize={stepSize}
					value={value && getRoundedValue(value)}
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
				value={value && getRoundedValue(value)}
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
				defaultValue={restProps.min || 0}
				onChange={([input]) => {
					onChange?.(input);

					return input;
				}}
			/>
		);
	}

	return <BaseSlider {...props} />;
};
