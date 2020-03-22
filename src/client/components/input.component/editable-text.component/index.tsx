import { Classes, EditableText as BpEditableText, Intent } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	defaultValue?: string;
	disabled?: boolean;
	intent?: Intent;
	maxLength?: number;
	onCancel?: (value: string) => void;
	onChange?: (value: string) => void;
	onConfirm?: (value: string) => void;
	placeholder?: string;
	value?: string;
}

export const EditableText: FC<IProps> = ({
	className,
	defaultValue,
	disabled,
	intent,
	maxLength,
	onCancel,
	onChange,
	onConfirm,
	placeholder,
	value
}) => {
	const classes = useStyles();

	return (
		<BpEditableText
			className={classnames(Classes.DARK, classes.root, className)}
			confirmOnEnterKey={true}
			defaultValue={defaultValue}
			disabled={disabled}
			intent={intent}
			maxLength={maxLength}
			onCancel={onCancel}
			onChange={onChange}
			onConfirm={onConfirm}
			placeholder={placeholder}
			value={value}
		/>
	);
};
