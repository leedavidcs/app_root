import { IconName } from "@blueprintjs/core";
import { FormGroup, Intent, NumericInput } from "@blueprintjs/core/lib/esm";
import React, { CSSProperties, FC, KeyboardEventHandler } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	disabled?: boolean;
	error?: Maybe<string>;
	icon?: IconName;
	inline?: boolean;
	label?: string;
	labelInfo?: string;
	max?: number;
	min?: number;
	majorStepSize?: number;
	minorStepSize?: number;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	onValueChange?: (valueAsNumber: number, valueAsString: string) => void;
	placeholder?: string;
	stepSize?: number;
	style?: CSSProperties;
	value?: number;
}

export const NumberInput: FC<IProps> = ({
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
				majorStepSize={majorStepSize}
				minorStepSize={minorStepSize}
				onKeyDown={onKeyDown}
				onValueChange={onValueChange}
				placeholder={placeholder}
				stepSize={stepSize}
				value={value}
			/>
		</FormGroup>
	);
};
