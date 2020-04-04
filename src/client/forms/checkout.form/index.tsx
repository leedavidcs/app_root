import { Carousel, Stepper } from "@/client/components";
import React, { FC, useCallback, useState } from "react";
import { BillingForm, IBillingFormData } from "./billing.form";
import { IPriceBundleFormData, PriceBundleForm } from "./price-bundle.form";
import { useStyles } from "./styles";

export * from "./billing.form";
export * from "./price-bundle.form";
export * from "./review-order.form";

const NUM_OF_STEPS = 3;

export const CheckoutForm: FC = () => {
	const classes = useStyles();

	const [activeSlide, setActiveSlide] = useState<number>(0);
	const [formData, setFormData] = useState<Partial<IPriceBundleFormData & IBillingFormData>>({});

	const onBack = useCallback(() => {
		const prevSlide: number = Math.max(activeSlide - 1, 0);

		setActiveSlide(prevSlide);
	}, [activeSlide]);
	const onNext = useCallback(() => {
		const nextSlide: number = Math.min(activeSlide + 1, NUM_OF_STEPS - 1);

		setActiveSlide(nextSlide);
	}, [activeSlide]);

	const onSubmitPriceBundleForm = useCallback(
		(priceBundleFormData: IPriceBundleFormData) => {
			setFormData({ ...formData, ...priceBundleFormData });
			onNext();
		},
		[formData, onNext]
	);

	const onSubmitBillingForm = useCallback(
		(billingFormData: IBillingFormData) => {
			setFormData({ ...formData, ...billingFormData });
			onNext();
		},
		[formData, onNext]
	);

	return (
		<div className={classes.root}>
			<Stepper activeStep={activeSlide} onClickStep={setActiveSlide}>
				<Stepper.Step label="Select a price bundle" />
				<Stepper.Step label="Checkout" />
				<Stepper.Step label="Review your order" />
			</Stepper>
			<div className={classes.carouselContainer}>
				<Carousel className={classes.carousel} activeSlide={activeSlide} showDots={false}>
					<Carousel.Slide>
						<PriceBundleForm
							className={classes.priceBundleForm}
							onSubmit={onSubmitPriceBundleForm}
						/>
					</Carousel.Slide>
					<Carousel.Slide>
						<BillingForm
							className={classes.billingForm}
							onBack={onBack}
							onSubmit={onSubmitBillingForm}
							orderDetails={formData.orderDetails}
						/>
					</Carousel.Slide>
					<Carousel.Slide>
						<div />
					</Carousel.Slide>
				</Carousel>
			</div>
		</div>
	);
};
