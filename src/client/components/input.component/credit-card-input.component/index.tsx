import { FormGroup } from "@/client/components/input.component/form-group.component";
import { useTheme } from "@/client/hooks";
import type { Intent } from "@blueprintjs/core";
import { CardElement, useElements } from "@stripe/react-stripe-js";
import {
	StripeCardElement,
	StripeCardElementChangeEvent,
	StripeCardElementOptions
} from "@stripe/stripe-js";
import classnames from "classnames";
import React, {
	forwardRef,
	ReactElement,
	useCallback,
	useImperativeHandle,
	useMemo,
	useState
} from "react";
import { useStyles } from "./styles";

interface IProps {
	cardElementClassName?: string;
	className?: string;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	onChange?: (event: StripeCardElementChangeEvent) => void;
}

export const CreditCardInput = forwardRef<Maybe<StripeCardElement>, IProps>(
	({ cardElementClassName, className, error, inline, label, onChange }, ref) => {
		const classes = useStyles();
		const { theme } = useTheme();

		const elements = useElements();

		const intent: Intent = error ? "danger" : "none";

		useImperativeHandle<Maybe<StripeCardElement>, Maybe<StripeCardElement>>(ref, () => {
			const cardElement: Maybe<StripeCardElement> = elements?.getElement(CardElement);

			return cardElement;
		});

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
			<FormGroup
				className={classnames(classes.root, className)}
				helperText={error}
				inline={inline}
				intent={intent}
				label={label}
			>
				<CardElement
					className={classnames(
						classes.cardElement,
						{ [classes.cardElementFocused]: focused },
						cardElementClassName
					)}
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
					options={options}
				/>
			</FormGroup>
		);
	}
);

CreditCardInput.displayName = "CreditCardInput";
