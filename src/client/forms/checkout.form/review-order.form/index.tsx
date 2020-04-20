import { Paper } from "@/client/components";
import { Context } from "@/client/forms/checkout.form/provider.component";
import { useApplySucceededTransactionMutation, useSetToastsMutation } from "@/client/graphql";
import { useToast } from "@/client/hooks";
import { OrderSummary } from "@/client/page-parts";
import { Button, FormGroup, Icon, Spinner } from "@blueprintjs/core";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import classnames from "classnames";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useContext, useState } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	onBack: () => void;
}

const useOnSubmit = () => {
	const { billingDetails, clientSecret } = useContext(Context);

	const [processing, setProcessing] = useState<boolean>(false);

	const elements = useElements()!;
	const stripe = useStripe()!;

	const toaster = useToast();

	const router: NextRouter = useRouter();

	const [setToasts] = useSetToastsMutation({ onCompleted: () => router.push("/") });

	const [applyTransaction] = useApplySucceededTransactionMutation({
		onCompleted: (transactionResult) => {
			const balance = transactionResult.applySucceededTransaction!;
			const message = `Success! Your balance is now: ${balance.credits}`;

			setToasts({ variables: { toasts: [{ intent: "success", message }] } });
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

export const ReviewOrderForm: FC<IProps> = ({ className, onBack }) => {
	const classes = useStyles();

	const { billingDetails, card, orderDetails } = useContext(Context);

	const { onSubmit, processing } = useOnSubmit();

	if (!billingDetails?.address || !card) {
		return null;
	}

	const { address, name } = billingDetails;
	const { city, country, line1, postal_code, state } = address!;

	return (
		<div className={classnames(className, classes.root)}>
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
									<div className={classes.creditCard}>
										Card ending in {card.last4}
									</div>
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
							text={
								processing ? <Spinner size={Spinner.SIZE_SMALL} /> : "Place Order"
							}
						/>
					</div>
				</OrderSummary>
			</div>
			<Button className={classes.backBtn} intent="primary" onClick={onBack} text="Back" />
		</div>
	);
};
