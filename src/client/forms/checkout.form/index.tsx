import {
	CountrySelect,
	CreditCardInput,
	Paper,
	RegionSelect,
	Slider,
	TextInput
} from "@/client/components";
import { getYupValidationResolver } from "@/client/utils";
import { Button, Radio, RadioGroup } from "@blueprintjs/core";
import { useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import React, { FC, FormEvent, useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { number, string } from "yup";
import { useStyles } from "./styles";

const CREDITS_TO_AMOUNT_CONVERSION = 0.01;
const MIN_CREDIT_AMOUNT = 100;

enum PaymentMethod {
	CREDIT_CARD = "CREDIT_CARD",
	PAYPAL = "PAYPAL"
}

interface IFormData {
	address: string;
	cardholder: string;
	city: string;
	country: string;
	credits: number;
	state: string;
	zipcode: string;
}

/* eslint-disable no-magic-numbers */
const validationResolver = getYupValidationResolver(() => ({
	address: string().required(),
	cardholder: string().required(),
	city: string().required(),
	country: string().required(),
	credits: number().required().min(100),
	state: string().required(),
	zipcode: string().required()
}));
/* eslint-enable no-magic-numbers */

export const CheckoutForm: FC = () => {
	const classes = useStyles();

	const [amountCredits, setAmountCredits] = useState<number>(MIN_CREDIT_AMOUNT);
	const [selectedCountry, setSelectedCountry] = useState<string>("US");
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(
		PaymentMethod.CREDIT_CARD
	);
	const [cardError, setCardError] = useState<Maybe<string>>(null);

	const cardElementRef = useRef<Maybe<StripeCardElement>>();

	const stripe = useStripe();

	const { control, errors, handleSubmit } = useForm<IFormData>({
		mode: "onChange",
		validationResolver
	});

	const onChangePaymentMethod = useCallback((event: FormEvent<HTMLInputElement>) => {
		const value = event.currentTarget.value as PaymentMethod;

		setSelectedPaymentMethod(value);
	}, []);

	const onChangeCardElement = useCallback(
		(event: StripeCardElementChangeEvent) => setCardError(event.error?.message),
		[]
	);

	const onSubmit = useCallback(
		handleSubmit(() => {
			const cardElement = cardElementRef.current;

			return undefined;
		}),
		[]
	);

	return (
		<form className={classes.form} onSubmit={onSubmit}>
			<Paper className={classes.section}>
				<h3>Set Credits to Purchase</h3>
				<div className={classes.sectionContent}>
					<Slider
						control={control}
						error={errors.credits?.message}
						inline={true}
						label="Credits"
						labelStepSize={1000}
						max={5000}
						min={MIN_CREDIT_AMOUNT}
						name="credits"
						onChange={setAmountCredits}
						stepSize={MIN_CREDIT_AMOUNT}
						withInput={true}
					/>
				</div>
			</Paper>
			<Paper className={classes.section}>
				<h3>Billing Details</h3>
				<div className={classes.sectionContent}>
					<CountrySelect
						control={control}
						error={errors.country?.message}
						label="Country"
						inline={true}
						name="country"
						onChange={setSelectedCountry}
						value={selectedCountry}
					/>
					<TextInput
						autoComplete="billing street-address"
						control={control}
						error={errors.address?.message}
						inline={true}
						label="Address"
						name="address"
						placeholder="Address"
					/>
					<TextInput
						autoComplete="billing locality"
						control={control}
						error={errors.city?.message}
						inline={true}
						label="City"
						name="city"
						placeholder="City"
					/>
					<RegionSelect
						control={control}
						country={selectedCountry}
						error={errors.state?.message}
						inline={true}
						label="State"
						name="state"
						placeholder="Select State/Province"
					/>
					<TextInput
						autoComplete="billing postal-code"
						control={control}
						error={errors.zipcode?.message}
						inline={true}
						label="Zip/Postal Code"
						name="zipcode"
						placeholder="Zip/Postal Code"
					/>
				</div>
			</Paper>
			<Paper className={classes.section}>
				<h3>Payment Method</h3>
				<RadioGroup
					className={classes.sectionContent}
					onChange={onChangePaymentMethod}
					selectedValue={selectedPaymentMethod}
				>
					<Radio label="Credit Card" value={PaymentMethod.CREDIT_CARD} />
					{selectedPaymentMethod === PaymentMethod.CREDIT_CARD && (
						<div className={classes.cardDetailsContainer}>
							<TextInput
								autoComplete="cc-name"
								control={control}
								error={errors.cardholder?.message}
								inline={true}
								label="Cardholder's name"
								name="cardholder"
								placeholder="Cardholder's name"
							/>
							<CreditCardInput
								error={cardError}
								label="Card details"
								inline={true}
								onChange={onChangeCardElement}
								ref={cardElementRef}
							/>
						</div>
					)}
					<Radio label="PayPal" value={PaymentMethod.PAYPAL} />
				</RadioGroup>
			</Paper>
			<Button
				className={classes.payBtn}
				disabled={!stripe}
				intent="primary"
				text={`Pay $${amountCredits * CREDITS_TO_AMOUNT_CONVERSION}`}
				type="submit"
			/>
		</form>
	);
};
