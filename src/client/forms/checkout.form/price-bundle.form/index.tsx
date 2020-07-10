import { Button, NonIdealState, Paper, Spinner } from "@/client/components";
import { Context } from "@/client/forms/checkout.form/provider.component";
import {
	GetPriceBundlesQuery,
	OrderDetailType,
	PriceBundle,
	useGetPriceBundlesQuery
} from "@/client/graphql";
import { IOrderDetail } from "@/client/page-parts";
import classnames from "classnames";
import React, { FC, useCallback, useContext } from "react";
import { useStyles } from "./styles";

export interface IPriceBundleFormData {
	orderDetails: readonly IOrderDetail[];
}

interface IProps {
	className?: string;
	onSubmit: () => void;
}

export const PriceBundleForm: FC<IProps> = ({ className, onSubmit: _onSubmit }) => {
	const classes = useStyles();

	const { setOrderDetails } = useContext(Context);

	const { data, error, loading } = useGetPriceBundlesQuery();

	const priceBundles = data?.priceBundles;

	const onSubmit = useCallback(
		({ id, credits, price }: PriceBundle) => () => {
			const orderDetail: IOrderDetail = {
				id,
				name: `${credits} Credits`,
				price,
				quantity: 1,
				type: OrderDetailType.PriceBundle
			};

			setOrderDetails?.([orderDetail]);

			_onSubmit();
		},
		[_onSubmit, setOrderDetails]
	);

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
