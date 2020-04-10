import { Carousel, Stepper } from "@/client/components";
import classnames from "classnames";
import React, { FC, useCallback, useState } from "react";
import { BillingForm } from "./billing.form";
import { PriceBundleForm } from "./price-bundle.form";
import { Provider } from "./provider.component";
import { ReviewOrderForm } from "./review-order.form";
import { useStyles } from "./styles";

export * from "./billing.form";
export * from "./price-bundle.form";
export * from "./review-order.form";

const NUM_OF_STEPS = 3;

interface IProps {
	className?: string;
}

export const CheckoutForm: FC<IProps> = ({ className }) => {
	const classes = useStyles();

	const [activeSlide, setActiveSlide] = useState<number>(0);

	const onBack = useCallback(() => {
		const prevSlide: number = Math.max(activeSlide - 1, 0);

		setActiveSlide(prevSlide);
	}, [activeSlide]);

	const onNext = useCallback(() => {
		const nextSlide: number = Math.min(activeSlide + 1, NUM_OF_STEPS - 1);

		setActiveSlide(nextSlide);
	}, [activeSlide]);

	return (
		<Provider>
			<div className={classnames(classes.root, className)}>
				<Stepper activeStep={activeSlide} onClickStep={setActiveSlide}>
					<Stepper.Step label="Select a price bundle" />
					<Stepper.Step label="Checkout" />
					<Stepper.Step label="Review your order" />
				</Stepper>
				<div className={classes.carouselContainer}>
					<Carousel
						className={classes.carousel}
						activeSlide={activeSlide}
						showDots={false}
					>
						<Carousel.Slide>
							<PriceBundleForm
								className={classes.priceBundleForm}
								onSubmit={onNext}
							/>
						</Carousel.Slide>
						<Carousel.Slide>
							<BillingForm
								className={classes.billingForm}
								onBack={onBack}
								onSubmit={onNext}
							/>
						</Carousel.Slide>
						<Carousel.Slide>
							<ReviewOrderForm onBack={onBack} />
						</Carousel.Slide>
					</Carousel>
				</div>
			</div>
		</Provider>
	);
};
