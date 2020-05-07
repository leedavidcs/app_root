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
	useCallback
} from "react";
import { Control, Controller } from "react-hook-form";
import { useStyles } from "./styles";

interface IProps {
	autoComplete?: string;
	children?: ReactElement;
	className?: string;
	control?: Control<any>;
	defaultValue?: string;
	disabled?: boolean;
	error?: Maybe<string | ReactElement>;
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

const BaseTextInput: FC<IProps> = ({
	autoComplete,
	children,
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
	onKeyDown: _onKeyDown,
	placeholder,
	style,
	type,
	value
}) => {
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
			<ControlGroup>
				<InputGroup
					className={classes.input}
					autoComplete={autoComplete}
					defaultValue={defaultValue}
					disabled={disabled}
					intent={intent}
					leftIcon={icon}
					name={name}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					spellCheck={false}
					type={type}
					value={value}
				/>
				{children}
			</ControlGroup>
		</FormGroup>
	);
};

export const TextInput: FC<IProps> = (props) => {
	const { control, defaultValue, name, value, onChange, ...restProps } = props;

	if (control) {
		if (!name) {
			throw new Error("Text input is used in a form without a name!");
		}

		return (
			<Controller
				as={BaseTextInput}
				control={control}
				name={name}
				{...restProps}
				defaultValue={defaultValue ?? ""}
				onChange={([event]) => event.target.value || ""}
			/>
		);
	}

	return <BaseTextInput {...props} />;
};
