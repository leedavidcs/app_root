import { Classes, FormGroup, Intent } from "@blueprintjs/core/lib/esm";
import { DateRange, DateRangeInput as BpDateRangeInput } from "@blueprintjs/datetime";
import classnames from "classnames";
import React, { CSSProperties, FC } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	disabled?: boolean;
	error?: string;
	inline?: boolean;
	label?: string;
	labelInfo?: string;
	maxDate?: Date;
	minDate?: Date;
	onChange?: (selectedRange: DateRange) => void;
	shortcuts?: boolean;
	style?: CSSProperties;
	value?: DateRange;
}

const formatDate = (date: Date) => date.toLocaleDateString();
const parseDate = (str: string) => new Date(str);

export const DateRangeInput: FC<IProps> = ({
	className,
	disabled,
	error,
	inline,
	label,
	labelInfo,
	maxDate,
	minDate,
	onChange,
	shortcuts,
	style,
	value
}) => {
	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	return (
		<FormGroup
			className={classnames(Classes.DARK, className)}
			disabled={disabled}
			helperText={error}
			inline={inline}
			intent={intent}
			label={label}
			labelInfo={labelInfo}
			style={style}
		>
			<BpDateRangeInput
				className={classnames(Classes.DARK, classes.input)}
				disabled={disabled}
				formatDate={formatDate}
				maxDate={maxDate}
				minDate={minDate}
				onChange={onChange}
				parseDate={parseDate}
				shortcuts={shortcuts}
				singleMonthOnly={true}
				value={value}
			/>
		</FormGroup>
	);
};
