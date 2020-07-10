import { FormGroup } from "@/client/components/input.component/form-group.component";
import type { Intent, IPopoverProps } from "@blueprintjs/core";
import type { DateRange } from "@blueprintjs/datetime";
import { DateRangeInput as BpDateRangeInput } from "@blueprintjs/datetime";
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
	minimal?: boolean;
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
	inlineInputs = true,
	label,
	labelInfo,
	maxDate,
	minDate,
	minimal,
	onChange,
	shortcuts,
	style,
	value
}) => {
	const classes = useStyles();

	const intent: Intent = error ? "danger" : "none";

	const popoverProps: Partial<IPopoverProps> = useMemo(
		() => ({
			minimal,
			popoverClassName: classes.popover
		}),
		[classes.popover, minimal]
	);

	return (
		<FormGroup
			className={classnames({ [classes.verticalInputs]: !inlineInputs }, className)}
			disabled={disabled}
			helperText={error}
			inline={inline}
			intent={intent}
			label={label}
			labelInfo={labelInfo}
			style={style}
		>
			<BpDateRangeInput
				className={classes.input}
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
