import { Button, Classes, ControlGroup, FormGroup, IconName, InputGroup } from "@blueprintjs/core";

import classnames from "classnames";
import KeyCode from "keycode";
import React, {
	CSSProperties,
	FC,
	FormEventHandler,
	KeyboardEventHandler,
	useCallback
} from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	disabled?: boolean;
	icon?: IconName;
	label?: string;
	labelInfo?: string;
	onChange: FormEventHandler<HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	onSubmit?: (value?: string) => void;
	placeholder?: string;
	style?: CSSProperties;
	value?: string;
}

export const SearchInput: FC<IProps> = ({
	className,
	disabled,
	icon = "search",
	label,
	labelInfo,
	onChange,
	onKeyDown: propsOnKeyDown,
	onSubmit: propsOnSubmit,
	placeholder = "Search...",
	style,
	value
}) => {
	const classes = useStyles();

	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
		(event) => {
			const { keyCode } = event;

			propsOnKeyDown?.(event);

			if (keyCode === KeyCode.codes.enter) {
				propsOnSubmit?.(value);
			}
		},
		[propsOnKeyDown, propsOnSubmit, value]
	);

	const onSubmit = useCallback(() => {
		propsOnSubmit?.(value);
	}, [propsOnSubmit, value]);

	return (
		<FormGroup
			className={classnames(classes.root, Classes.DARK, className)}
			disabled={disabled}
			label={label}
			labelInfo={labelInfo}
			style={style}
		>
			<ControlGroup>
				<InputGroup
					className={classes.input}
					disabled={disabled}
					leftIcon={icon as IconName}
					onChange={onChange}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					value={value}
				/>
				<Button icon="arrow-right" onClick={onSubmit} />
			</ControlGroup>
		</FormGroup>
	);
};
