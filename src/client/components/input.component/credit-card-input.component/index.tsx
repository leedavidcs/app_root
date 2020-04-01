import { useTheme } from "@/client/hooks";
import { FormGroup } from "@blueprintjs/core";
import { CardElement } from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";
import classnames from "classnames";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useStyles } from "./styles";

interface IProps {
	cardElementClassName?: string;
	className?: string;
	inline?: boolean;
	label?: string;
}

export const CreditCardInput: FC<IProps> = ({ cardElementClassName, className, inline, label }) => {
	const classes = useStyles();
	const { theme } = useTheme();

	const [focused, setFocused] = useState<boolean>(false);

	const onFocus = useCallback(() => setFocused(true), []);
	const onBlur = useCallback(() => setFocused(false), []);

	const options: StripeCardElementOptions = useMemo(
		() => ({
			iconStyle: "solid",
			style: {
				base: {
					iconColor: theme.onSurface,
					color: theme.onSurface,
					fontFamily: theme.fontPrimary
				}
			}
		}),
		[theme.fontPrimary, theme.onSurface]
	);

	return (
		<FormGroup className={classnames(classes.root, className)} inline={inline} label={label}>
			<CardElement
				className={classnames(
					classes.cardElement,
					{ [classes.cardElementFocused]: focused },
					cardElementClassName
				)}
				onFocus={onFocus}
				onBlur={onBlur}
				options={options}
			/>
		</FormGroup>
	);
};
