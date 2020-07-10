import { FormGroup } from "@/client/components/input.component/form-group.component";
import type { Intent } from "@blueprintjs/core";
import { EditableText as BpEditableText } from "@blueprintjs/core";
import React, { CSSProperties, FC, memo, ReactElement, useMemo } from "react";
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

const BaseEditableText: FC<IProps> = ({
	className,
	defaultValue,
	error,
	disabled,
	maxLength,
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

	return (
		<FormGroup
			className={className}
			disabled={disabled}
			helperText={error}
			intent={intent}
			style={style}
		>
			<BpEditableText
				{...inputProps}
				onCancel={onCancel}
				onChange={onChange}
				onConfirm={onConfirm}
				value={value}
			/>
		</FormGroup>
	);
};

export const EditableText: FC<IProps> = memo((props) => {
	const { control, name, defaultValue, onChange: _onChange, value: _value, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Editable text is used in a form without a name!");
		}

		return (
			<Controller
				control={control}
				name={name}
				render={({ onChange, value }) => (
					<BaseEditableText
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

	return <BaseEditableText {...props} />;
});

EditableText.displayName = "EditableText";
