import { Paper } from "@/client/components";
import { GetPriceBundlesQuery, PriceBundle, useGetPriceBundlesQuery } from "@/client/graphql";
import { Button, NonIdealState, Spinner } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, useCallback } from "react";
import { useStyles } from "./styles";

export interface IPriceBundleFormData {
	priceBundle: PriceBundle;
}

interface IProps {
	className?: string;
	onSubmit: (formData: IPriceBundleFormData) => void;
}

export const PriceBundleForm: FC<IProps> = ({ className, onSubmit: _onSubmit }) => {
	const classes = useStyles();

	const { data, error, loading } = useGetPriceBundlesQuery();

	const priceBundles = data?.priceBundles;

	const onSubmit = useCallback((priceBundle: PriceBundle) => () => _onSubmit({ priceBundle }), [
		_onSubmit
	]);

	const getPriceBundleElements = useCallback(
		(bundles: NonNullable<GetPriceBundlesQuery["priceBundles"]>) => {
			if (!bundles.length) {
				return null;
			}

			const baseBundle = bundles[0];
			const baseRatio = baseBundle.credits / baseBundle.price;

			return (
				<>
					{bundles.map((bundle) => {
						const { id, credits, price } = bundle;

						const bundleRatio: number = credits / price;
						const bonusPercent: number = Math.ceil(bundleRatio - baseRatio);

						return (
							<Paper key={id} className={classes.priceBundle}>
								<div className={classes.priceBundleContent}>
									<h2>{credits} Credits</h2>
									{bonusPercent !== 0 && <p>{bonusPercent}% Bonus!</p>}
								</div>
								<div className={classes.priceBundleBtnContainer}>
									<Button
										className={classes.priceBundleBtn}
										intent="primary"
										onClick={onSubmit(bundle)}
										text={`$${price}`}
									/>
								</div>
							</Paper>
						);
					})}
				</>
			);
		},
		[
			classes.priceBundle,
			classes.priceBundleBtn,
			classes.priceBundleBtnContainer,
			classes.priceBundleContent,
			onSubmit
		]
	);

	return (
		<div className={classnames(classes.root, className)}>
			<h1>All features available under any bundle.</h1>
			<p>Try the basic features for free. Redeem credits for advanced features.</p>
			<div className={classes.bundlesContainer}>
				{loading ? (
					<NonIdealState
						icon={<Spinner />}
						title="Loading..."
						description="Price bundles are being loaded..."
					/>
				) : !priceBundles || error ? (
					<NonIdealState
						icon="error"
						title="Something went wrong..."
						description="Could not fetch price bundles. Pleases try again later."
					/>
				) : (
					getPriceBundleElements(priceBundles)
				)}
			</div>
		</div>
	);
};
