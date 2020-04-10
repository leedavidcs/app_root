import { Paper } from "@/client/components";
import { OrderSummary } from "@/client/components/order-summary.component";
import { Context } from "@/client/forms/checkout.form/provider.component";
import { useApplySucceededTransactionMutation } from "@/client/graphql";
import { useToast } from "@/client/hooks";
import { Button, FormGroup, Icon, Spinner } from "@blueprintjs/core";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useContext, useState } from "react";
import { useStyles } from "./styles";

interface IProps {
	onBack: () => void;
}

const useOnSubmit = () => {
	const { billingDetails, clientSecret } = useContext(Context);

	const [processing, setProcessing] = useState<boolean>(false);

	const elements = useElements()!;
	const stripe = useStripe()!;

	const toaster = useToast();

	const router: NextRouter = useRouter();

	const [applyTransaction] = useApplySucceededTransactionMutation({
		onCompleted: (transactionResult) => {
			const balance = transactionResult.applySucceededTransaction!;

			const successMessage = `Success! Your balance is now: ${balance.credits}`;

			router.push("/");
		}
	});

	const onSubmit = useCallback(async () => {
		setProcessing(true);

		const cardElement = elements.getElement(CardElement)!;

		const paymentResult = await stripe.confirmCardPayment(clientSecret!, {
			payment_method: {
				card: cardElement,
				billing_details: billingDetails!
			}
		});

		/** Stripe failure. User must take action, depending on what stripe says. */
		if (paymentResult.error) {
			toaster.show({ message: paymentResult.error.message });

			return;
		}

		const paymentIntentId: string = paymentResult.paymentIntent!.id;

		applyTransaction({ variables: { paymentIntentId } });
	}, [applyTransaction, billingDetails, clientSecret, elements, stripe, toaster]);

	return { onSubmit, processing };
};

export const ReviewOrderForm: FC<IProps> = ({ onBack }) => {
	const classes = useStyles();

	const { orderDetails, billingDetails } = useContext(Context);

	const { name } = billingDetails!;
	const { city, country, line1, postal_code, state } = billingDetails!.address!;

	const { onSubmit, processing } = useOnSubmit();

	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<div className={classes.inputsContainer}>
					<Paper className={classes.section}>
						<h3>Billing Details</h3>
						<div className={classes.sectionContent}>
							<FormGroup inline={true} label="Country:">
								{country}
							</FormGroup>
							<FormGroup inline={true} label="Address:">
								{line1}
							</FormGroup>
							<FormGroup inline={true} label="City:">
								{city}
							</FormGroup>
							<FormGroup inline={true} label="State:">
								{state}
							</FormGroup>
							<FormGroup inline={true} label="Zip/Postal Code:">
								{postal_code}
							</FormGroup>
						</div>
					</Paper>
					<Paper className={classes.section}>
						<h3>Payment Method</h3>
						<div className={classes.sectionContent}>
							<FormGroup inline={true} label="Cardholder's name:">
								{name}
							</FormGroup>
							<FormGroup inline={true} label="Card details">
								<div className={classes.creditCardDetails}>
									<Icon icon="credit-card" />
									<div className={classes.creditCard}>(Not shown in review)</div>
								</div>
							</FormGroup>
						</div>
					</Paper>
				</div>
				<OrderSummary className={classes.orderSummary} orderDetails={orderDetails}>
					<div className={classes.payBtnContainer}>
						<Button
							className={classes.payBtn}
							disabled={processing}
							intent="primary"
							onClick={onSubmit}
							text={processing ? <Spinner /> : "Place Order"}
						/>
					</div>
				</OrderSummary>
			</div>
			<Button intent="primary" onClick={onBack} text="Back" />
		</div>
	);
};
