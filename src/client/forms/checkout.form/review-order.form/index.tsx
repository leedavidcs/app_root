import { Paper } from "@/client/components";
import { OrderSummary } from "@/client/components/order-summary.component";
import { IBillingFormData, IPriceBundleFormData } from "@/client/forms/checkout.form";
import { Button, FormGroup, Icon } from "@blueprintjs/core";
import React, { FC } from "react";
import { useStyles } from "./styles";

interface IProps {
	checkoutData: Partial<IPriceBundleFormData & IBillingFormData>;
	onBack: () => void;
}

export const ReviewOrderForm: FC<IProps> = ({ checkoutData, onBack }) => {
	const classes = useStyles();

	const { orderDetails, address, cardholder, city, country, state, zipcode } = checkoutData;

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
								{address}
							</FormGroup>
							<FormGroup inline={true} label="City:">
								{city}
							</FormGroup>
							<FormGroup inline={true} label="State:">
								{state}
							</FormGroup>
							<FormGroup inline={true} label="Zip/Postal Code:">
								{zipcode}
							</FormGroup>
						</div>
					</Paper>
					<Paper className={classes.section}>
						<h3>Payment Method</h3>
						<div className={classes.sectionContent}>
							<FormGroup inline={true} label="Cardholder's name:">
								{cardholder}
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
						<Button className={classes.payBtn} intent="primary" text="Place Order" />
					</div>
				</OrderSummary>
			</div>
			<Button intent="primary" onClick={onBack} text="Back" />
		</div>
	);
};
