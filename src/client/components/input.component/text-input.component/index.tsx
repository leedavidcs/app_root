import { FormGroup, IconName, InputGroup, Intent } from "@blueprintjs/core";
import React, { CSSProperties, FormEventHandler, forwardRef, KeyboardEventHandler } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	defaultValue?: string;
	disabled?: boolean;
	error?: string | null;
	icon?: IconName;
	inline?: boolean;
	label?: string;
	labelInfo?: string;
	name?: string;
	onChange?: FormEventHandler<HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	placeholder?: string;
	style?: CSSProperties;
	type?: string;
	value?: string;
}

export const TextInput = forwardRef<InputGroup, IProps>(
	(
		{
			className,
			defaultValue,
			disabled,
			error,
			icon,
			inline,
			label,
			labelInfo,
			name,
			onChange,
			onKeyDown,
			placeholder,
			style,
			type,
			value
		},
		ref
	) => {
		const classes = useStyles();

		const intent: Intent = error ? "danger" : "none";

		return (
			<FormGroup
				className={className}
				disabled={disabled}
				helperText={error}
				inline={inline}
				label={label}
				labelInfo={labelInfo}
				intent={intent}
				style={style}
			>
				<InputGroup
					ref={ref}
					className={classes.input}
					defaultValue={defaultValue}
					disabled={disabled}
					intent={intent}
					leftIcon={icon}
					name={name}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					type={type}
					value={value}
				/>
			</FormGroup>
		);
	}
);

TextInput.displayName = "TextInput";
