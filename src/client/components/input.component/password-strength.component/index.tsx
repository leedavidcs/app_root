import classnames from "classnames";
import React, { FC, useMemo } from "react";
import zxcvbn from "zxcvbn";
import { useStyles } from "./styles";

const MAX_PERCENTAGE = 100;

const strengths = ["Weak", "Weak", "Fair", "Good", "Strong"] as const;

interface IProps {
	/** Optional classes to pass to the outermost `div` */
	className?: string;
	/** The password text to check the strength of */
	password?: string;
}

export const PasswordStrength: FC<IProps> = ({ className, password = "" }) => {
	const classes = useStyles();

	const { score } = useMemo(() => zxcvbn(password), [password]);

	const strength = strengths[score];

	const percentage: number = useMemo(() => {
		const portion: number = MAX_PERCENTAGE / (strengths.length - 1);

		return portion * score;
	}, [score]);

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.meter}>
				<div
					className={classnames(classes.meterFill, {
						[classes.weak]: strength === "Weak",
						[classes.fair]: strength === "Fair",
						[classes.good]: strength === "Good",
						[classes.strong]: strength === "Strong"
					})}
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<div className={classes.textWrapper}>
				<strong>Password strength:</strong> {strength}
			</div>
		</div>
	);
};
