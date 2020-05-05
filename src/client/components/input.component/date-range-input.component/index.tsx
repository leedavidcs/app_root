import { Classes, FormGroup, Intent, IPopoverProps } from "@blueprintjs/core";
import { DateRange, DateRangeInput as BpDateRangeInput } from "@blueprintjs/datetime";
import classnames from "classnames";
import React, { CSSProperties, FC, useMemo } from "react";
import { useStyles } from "./styles";

interface IProps {
	allowSingleDayRange?: boolean;
	className?: string;
	disabled?: boolean;
	error?: string;
	inline?: boolean;
	inlineInputs?: boolean;
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
	allowSingleDayRange,
	className,
	disabled,
	error,
	inline,
	inlineInputs = false,
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

	const popoverProps: Partial<IPopoverProps> = useMemo(
		() => ({
			popoverClassName: classes.popover
		}),
		[classes.popover]
	);

	return (
		<FormGroup
			className={classnames(
				Classes.DARK,
				{
					[classes.inlineInputs]: inlineInputs
				},
				className
			)}
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
				allowSingleDayRange={allowSingleDayRange}
				disabled={disabled}
				formatDate={formatDate}
				maxDate={maxDate}
				minDate={minDate}
				onChange={onChange}
				parseDate={parseDate}
				popoverProps={popoverProps}
				shortcuts={shortcuts}
				singleMonthOnly={true}
				value={value}
			/>
		</FormGroup>
	);
};
