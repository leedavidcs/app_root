import { ControlGroup, FormGroup, IconName, InputGroup, Intent } from "@blueprintjs/core";
import classnames from "classnames";
import Keycode from "keycode";
import React, {
	CSSProperties,
	FC,
	FormEventHandler,
	KeyboardEvent,
	KeyboardEventHandler,
	ReactElement,
	useCallback,
	useMemo
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	children?: ReactElement;
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
		children,
		className,
		control: _control,
		defaultValue,
		disabled,
		error,
		icon,
		inline,
		label,
		labelInfo,
		name,
		onChange,
		onKeyDown: _onKeyDown,
		placeholder,
		style,
		type,
		value
	} = props;

	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	const onKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			const { keyCode } = event;

			switch (keyCode) {
				case Keycode.codes.enter:
					event.preventDefault();
					break;
				default:
			}

			_onKeyDown?.(event);
		},
		[_onKeyDown]
	);

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
			type
		}),
		[classes, defaultValue, disabled, icon, intent, name, onKeyDown, placeholder, type]
	);

	const getAsController = useCallback(
		(control: NonNullable<IProps["control"]>) => {
			if (!name) {
				throw new Error("Input is used in a form without a name!");
			}

			return <Controller as={InputGroup} control={control} {...inputProps} name={name} />;
		},
		[name, inputProps]
	);

	const getAsInput = useCallback(() => {
		return <InputGroup onChange={onChange} value={value} {...inputProps} />;
	}, [inputProps, onChange, value]);

	return (
		<FormGroup
			className={classnames(classes.root, className)}
			disabled={disabled}
			helperText={error}
			inline={inline}
			label={label}
			labelInfo={labelInfo}
			intent={intent}
			style={style}
		>
			<ControlGroup>
				{_control ? getAsController(_control) : getAsInput()}
				{children}
			</ControlGroup>
		</FormGroup>
	);
};
