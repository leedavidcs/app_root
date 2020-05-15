import type { Intent } from "@blueprintjs/core";
import { FormGroup as BpFormGroup } from "@blueprintjs/core";
import React, { CSSProperties, FC, ReactNode } from "react";

interface IProps {
	children?: ReactNode;
	className?: string;
	contentClassName?: string;
	disabled?: boolean;
	helperText?: ReactNode;
	inline?: boolean;
	intent?: Intent;
	label?: ReactNode;
	labelFor?: string;
	labelInfo?: ReactNode;
	style?: CSSProperties;
}

export const FormGroup: FC<IProps> = ({
	children,
	className,
	contentClassName,
	disabled,
	helperText,
	inline,
	intent,
	label,
	labelFor,
	labelInfo,
	style
}) => {
	return (
		<BpFormGroup
			className={className}
			contentClassName={contentClassName}
			disabled={disabled}
			helperText={helperText}
			inline={inline}
			intent={intent}
			label={label}
			labelFor={labelFor}
			labelInfo={labelInfo}
			style={style}
		>
			{children}
		</BpFormGroup>
	);
};
