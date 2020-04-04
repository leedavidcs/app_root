import {
	CountrySelect,
	CreditCardInput,
	Paper,
	RegionSelect,
	TextInput
} from "@/client/components";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import { StripeCardElement, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import classnames from "classnames";
import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { string } from "yup";
import { OrderDetail } from "./order-detail.component";
import { useStyles } from "./styles";

export interface IBillingFormData {
	address: string;
	cardholder: string;
	city: string;
	country: string;
	state: string;
	zipcode: string;
}

export interface IOrderDetail {
	item: string;
	quantity: number;
	price: number;
}

interface IProps {
	className?: string;
	onBack: () => void;
	onSubmit: (formData: IBillingFormData) => void;
	orderDetails?: readonly IOrderDetail[];
}

const validationResolver = getYupValidationResolver(() => ({
	address: string().required(),
	cardholder: string().required(),
	city: string().required(),
	country: string().required(),
	state: string().required(),
	zipcode: string().required()
}));

export const BillingForm: FC<IProps> = ({
	className,
	onBack,
	onSubmit: _onSubmit,
	orderDetails = []
}) => {
	const classes = useStyles();

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

	const onSubmit = useCallback(
		(billingData: IBillingFormData) => {
			if (cardError) {
				return;
			}

			_onSubmit(billingData);
		},
		[_onSubmit, cardError]
	);

	const orderSummary = useMemo(
		() =>
			orderDetails.reduce(
				(acc, { price, quantity }) => ({
					items: acc.items + quantity,
					price: acc.price + price
				}),
				{ items: 0, price: 0 } as { items: number; price: number }
			),
		[orderDetails]
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
				<Paper className={classes.orderDetails}>
					<h3>Order Summary</h3>
					<div className={classes.sectionContent}>
						{orderDetails.map(({ item, quantity, price }) => (
							<OrderDetail key={item} item={item} quantity={quantity} price={price} />
						))}
					</div>
					<div className={classes.totalAndSubmit}>
						<div className={classes.totalPriceContainer}>
							Order total:
							<div className={classes.totalPrice}>${orderSummary.price}</div>
						</div>
						<div className={classes.reviewOrderBtnContainer}>
							<Button
								className={classes.reviewOrderBtn}
								intent="primary"
								text="Review Order"
								type="submit"
							/>
						</div>
					</div>
				</Paper>
			</div>
			<Button className={classes.backBtn} intent="primary" onClick={onBack} text="Back" />
		</form>
	);
};
