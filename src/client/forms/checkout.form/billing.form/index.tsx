import {
	Button,
	CountrySelect,
	CreditCardInput,
	Paper,
	RegionSelect,
	Spinner,
	TextInput
} from "@/client/components";
import { Context } from "@/client/forms/checkout.form/provider.component";
import {
	useCancelStripeSetupIntentMutation,
	useCreateStripePaymentIntentMutation,
	useCreateStripeSetupIntentMutation
} from "@/client/graphql";
import { useToast } from "@/client/hooks";
import { OrderSummary } from "@/client/page-parts";
import { getYupValidationResolver } from "@/client/utils";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import classnames from "classnames";
import React, { FC, useCallback, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { useStyles } from "./styles";

export interface IBillingFormData {
	line1: string;
	cardholder: string;
	city: string;
	country: string;
	state: string;
	postal_code: string;
}

interface IProps {
	className?: string;
	onBack: () => void;
	onSubmit: () => void;
}

const validationResolver = getYupValidationResolver<IBillingFormData>(() => ({
	line1: string().required(),
	cardholder: string().required(),
	city: string().required(),
	country: string().required(),
	state: string().required(),
	postal_code: string().required()
}));

const useOnSubmit = ({ onSubmit: _onSubmit }: IProps) => {
	const { orderDetails, setBillingDetails, setCard, setClientSecret } = useContext(Context);

	const [processing, setProcessing] = useState<boolean>(false);

	const billingDataRef = useRef<IBillingFormData>();

	const elements = useElements()!;
	const stripe = useStripe()!;

	const toaster = useToast();

	const [cancelSetupIntent] = useCancelStripeSetupIntentMutation({
		onCompleted: () => setProcessing(false)
	});

	const [createPaymentIntent] = useCreateStripePaymentIntentMutation({
		onCompleted: (paymentIntentResult) => {
			const { cardholder: name, ...address } = billingDataRef.current!;

			const createdPaymentIntent = paymentIntentResult.createStripePaymentIntent;

			if (
				!createdPaymentIntent?.payment_method?.card ||
				!createdPaymentIntent?.client_secret
			) {
				toaster.show({ message: "Failed to create transaction. Please try again later." });

				return;
			}

			const selectedCard = createdPaymentIntent.payment_method.card;

			setBillingDetails?.({ address, name });
			setCard?.(selectedCard);
			setClientSecret?.(createdPaymentIntent.client_secret);
			setProcessing(false);

			_onSubmit();
		}
	});

	const [createSetupIntent] = useCreateStripeSetupIntentMutation({
		onCompleted: async (setupIntentResult) => {
			const { cardholder: name, ...address } = billingDataRef.current!;

			const createdSetupIntent = setupIntentResult.createStripeSetupIntent;

			/** Unexpected failure. Should not reach here. */
			if (!createdSetupIntent?.client_secret) {
				toaster.show({ message: "Failed to save payment data. Please try again later." });

				return;
			}

			const cardElement: StripeCardElement = elements.getElement(CardElement)!;

			const setupResult = await stripe.confirmCardSetup(createdSetupIntent.client_secret, {
				payment_method: {
					card: cardElement,
					billing_details: { address, name }
				}
			});

			/** Stripe failure. User must take action, depending on what stripe says. */
			if (setupResult.error) {
				toaster.show({ message: setupResult.error.message });

				await cancelSetupIntent({ variables: { id: createdSetupIntent.id } });

				return;
			}

			const paymentMethodId: string = setupResult.setupIntent!.payment_method!;

			createPaymentIntent({
				variables: {
					orderDetails: orderDetails.map(({ id, quantity, type }) => ({
						id,
						quantity,
						type
					})),
					paymentMethodId
				}
			});
		}
	});

	const onSubmit = useCallback(
		(billingData: IBillingFormData) => {
			billingDataRef.current = billingData;

			setProcessing(true);

			createSetupIntent();
		},
		[createSetupIntent]
	);

	return { onSubmit, processing };
};

export const BillingForm: FC<IProps> = (props) => {
	const { className, onBack } = props;

	const classes = useStyles();

	const { orderDetails } = useContext(Context);

	const [selectedCountry, setSelectedCountry] = useState<string>("US");
	const [cardError, setCardError] = useState<Maybe<string>>(null);

	const { control, errors, handleSubmit } = useForm<IBillingFormData>({
		mode: "onChange",
		validationResolver
	});

	const onChangeCardElement = useCallback(
		(event: StripeCardElementChangeEvent) => setCardError(event.error?.message),
		[]
	);

	const cardElementRef = useRef<Maybe<StripeCardElement>>();

	const { onSubmit: _onSubmit, processing } = useOnSubmit(props);

	const onSubmit = useCallback(
		(billingData: IBillingFormData) => {
			if (cardError) {
				return;
			}

			_onSubmit(billingData);
		},
		[_onSubmit, cardError]
	);

	return (
		<form className={classnames(classes.root, className)} onSubmit={handleSubmit(onSubmit)}>
			<div className={classes.container}>
				<div className={classes.inputsContainer}>
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
								error={errors.line1?.message}
								inline={true}
								label="Address"
								name="line1"
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
								error={errors.postal_code?.message}
								inline={true}
								label="Zip/Postal Code"
								name="postal_code"
								placeholder="Zip/Postal Code"
							/>
						</div>
					</Paper>
					<Paper className={classes.section}>
						<h3>Payment Method</h3>
						<div className={classes.sectionContent}>
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
					</Paper>
				</div>
				<OrderSummary className={classes.orderSummary} orderDetails={orderDetails}>
					<div className={classes.reviewOrderBtnContainer}>
						<Button
							className={classes.reviewOrderBtn}
							disabled={processing}
							intent="primary"
							text={processing ? <Spinner size={20} /> : "Review Order"}
							type="submit"
						/>
					</div>
				</OrderSummary>
			</div>
			<Button className={classes.backBtn} intent="primary" onClick={onBack} text="Back" />
		</form>
	);
};
