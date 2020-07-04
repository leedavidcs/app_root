import { FormGroup } from "@/client/components/input.component/form-group.component";
import type { Intent } from "@blueprintjs/core";
import { TimePicker as BpTimePicker } from "@blueprintjs/datetime";
import { set } from "date-fns";
import React, { CSSProperties, FC, ReactElement } from "react";
import { Control, Controller } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: Control<any>;
	defaultValue?: Date;
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	labelInfo?: string;
	maxTime?: Date;
	minTime?: Date;
	name?: string;
	onChange?: (newTime: Date) => void;
	showArrowButtons?: boolean;
	style?: CSSProperties;
	value?: Date;
}

const BaseTimePicker: FC<IProps> = ({
	className,
	defaultValue,
	disabled,
	error,
	inline,
	label,
	labelInfo,
	maxTime,
	minTime,
	onChange,
	showArrowButtons,
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
			<BpTimePicker
				className={classes.timepicker}
				defaultValue={defaultValue}
				disabled={disabled}
				maxTime={maxTime}
				minTime={minTime}
				onChange={onChange}
				precision="minute"
				selectAllOnFocus={true}
				showArrowButtons={showArrowButtons}
				useAmPm={false}
				value={value ?? set(Date.now(), { hours: 0, minutes: 0 })}
			/>
		</FormGroup>
	);
};

export const TimePicker: FC<IProps> = (props) => {
	const { control, defaultValue, name, onChange: _onChange, value: _value, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("TimePicker is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				render={({ onChange, value }) => (
					<BaseTimePicker
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

	return <BaseTimePicker {...props} />;
};
