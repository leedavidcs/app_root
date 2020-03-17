import { FormGroup, IconName, InputGroup, Intent } from "@blueprintjs/core";

import React, {
	CSSProperties,
	FC,
	FormEventHandler,
	KeyboardEventHandler,
	useCallback,
	useMemo
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: ReturnType<typeof useForm>["control"];
	defaultValue?: string;
	disabled?: boolean;
	error?: Maybe<string>;
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

export const TextInput: FC<IProps> = (props) => {
	const {
		className,
		control: useFormControl,
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
	} = props;

	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	const inputProps = useMemo(
		() => ({
			className: classes.input,
			defaultValue,
			disabled,
			intent,
			leftIcon: icon as IconName,
			name,
			onKeyDown,
			placeholder,
			type,
			value
		}),
		[classes, defaultValue, disabled, icon, intent, name, onKeyDown, placeholder, type, value]
	);

	const getAsController = useCallback(
		(control: NonNullable<IProps["control"]>) => {
			return (
				<Controller as={InputGroup} control={control} {...inputProps} name={name || ""} />
			);
		},
		[name, inputProps]
	);

	const getAsInput = useCallback(() => {
		return <InputGroup onChange={onChange} value={value} {...inputProps} />;
	}, [inputProps, onChange, value]);

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
			{useFormControl ? getAsController(useFormControl) : getAsInput()}
		</FormGroup>
	);
};
