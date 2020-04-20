import { EditableText as BpEditableText, FormGroup, Intent } from "@blueprintjs/core";
import React, { CSSProperties, FC, ReactElement, useCallback, useMemo } from "react";
import { Control, Controller } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	control?: Control<any>;
	defaultValue?: string;
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
	maxLength?: number;
	name?: string;
	onCancel?: (value: string) => void;
	onChange?: (value: string) => void;
	onConfirm?: (value: string) => void;
	placeholder?: string;
	style?: CSSProperties;
	value?: string;
}

export const EditableText: FC<IProps> = ({
	className,
	control: _control,
	defaultValue,
	error,
	disabled,
	maxLength,
	name,
	onCancel,
	onChange,
	onConfirm,
	placeholder,
	style,
	value
}) => {
	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	const inputProps = useMemo(
		() => ({
			className: classes.root,
			confirmOnEnterKey: true,
			defaultValue,
			disabled,
			intent,
			maxLength,
			placeholder
		}),
		[classes.root, defaultValue, disabled, intent, maxLength, placeholder]
	);

	const getAsController = useCallback(
		(control: NonNullable<IProps["control"]>) => {
			if (!name) {
				throw new Error("Input is used in a form without a name!");
			}

			return <Controller as={BpEditableText} control={control} {...inputProps} name={name} />;
		},
		[inputProps, name]
	);

	const getAsInput = useCallback(() => {
		return (
			<BpEditableText
				{...inputProps}
				onCancel={onCancel}
				onChange={onChange}
				onConfirm={onConfirm}
				value={value}
			/>
		);
	}, [inputProps, onCancel, onChange, onConfirm, value]);

	return (
		<FormGroup
			className={className}
			disabled={disabled}
			helperText={error}
			intent={intent}
			style={style}
		>
			{_control ? getAsController(_control) : getAsInput()}
		</FormGroup>
	);
};
