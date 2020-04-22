import { FormGroup, IconName, Intent, NumericInput } from "@blueprintjs/core";
import React, { CSSProperties, FC, KeyboardEventHandler, ReactElement } from "react";
import { Control, Controller } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: Control<any>;
	defaultValue?: number;
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
	icon?: IconName;
	inline?: boolean;
	label?: string;
	labelInfo?: string;
	max?: number;
	min?: number;
	majorStepSize?: number;
	minorStepSize?: number;
	name?: string;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	onValueChange?: (valueAsNumber: number, valueAsString: string) => void;
	placeholder?: string;
	stepSize?: number;
	style?: CSSProperties;
	value?: number;
}

const BaseNumberInput: FC<IProps> = ({
	className,
	disabled,
	error,
	icon,
	inline,
	label,
	labelInfo,
	max,
	min,
	majorStepSize,
	minorStepSize,
	name,
	onKeyDown,
	onValueChange,
	placeholder,
	stepSize,
	style,
	value
}) => {
	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	return (
		<FormGroup
			className={className}
			disabled={disabled}
			helperText={error}
			inline={inline}
			intent={intent}
			label={label}
			labelInfo={labelInfo}
			style={style}
		>
			<NumericInput
				className={classes.input}
				allowNumericCharactersOnly={true}
				clampValueOnBlur={true}
				disabled={disabled}
				fill={true}
				intent={intent}
				leftIcon={icon}
				max={max}
				min={min}
				majorStepSize={majorStepSize ?? stepSize}
				minorStepSize={minorStepSize ?? stepSize}
				name={name}
				onKeyDown={onKeyDown}
				onValueChange={onValueChange}
				placeholder={placeholder}
				stepSize={stepSize}
				value={value}
			/>
		</FormGroup>
	);
};

export const NumberInput: FC<IProps> = (props) => {
	const {
		control,
		defaultValue = Math.min(Math.max(0, props.min ?? 0), props.max ?? Infinity),
		name,
		value,
		onValueChange,
		...restProps
	} = props;

	if (control) {
		if (!name) {
			throw new Error("Number input is used in a form without a name!");
		}

		return (
			<Controller
				as={BaseNumberInput}
				control={control}
				name={name}
				defaultValue={defaultValue}
				{...restProps}
				onChange={([valueAsNumber]) => valueAsNumber}
				onChangeName="onValueChange"
			/>
		);
	}

	return <BaseNumberInput {...props} />;
};
