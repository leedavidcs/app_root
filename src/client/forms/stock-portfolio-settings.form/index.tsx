import { Button, Switch } from "@/client/components";
import {
	FeaturePricing as _FeaturePricing,
	StockData,
	StockPortfolio as _StockPortfolio,
	StockPortfolioSettings,
	useGetFeaturePricingQuery,
	useUpdateStockPortfolioSettingsMutation
} from "@/client/graphql";
import { useOnFormSubmitError, useToast } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import classnames from "classnames";
import Link from "next/link";
import React, { CSSProperties, FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { boolean, object } from "yup";
import { useStyles } from "./styles";

type StockPortfolio = Pick<_StockPortfolio, "id"> & {
	stockData: Pick<StockData, "refreshCost">;
	settings: Pick<StockPortfolioSettings, "enableSnapshots">;
};
type FeaturePricing = Pick<_FeaturePricing, "snapshot">;

interface IProps {
	className?: string;
	stockPortfolio: StockPortfolio;
	style?: CSSProperties;
}

interface IFormData {
	data: {
		enableSnapshots: boolean;
	};
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	data: object().shape({
		enableSnapshots: boolean()
	})
}));

const computeNewCost = (
	stockPortfolio: StockPortfolio,
	formData: IFormData,
	featurePricing: FeaturePricing
): number => {
	const { refreshCost } = stockPortfolio.stockData;
	const { settings } = stockPortfolio;

	const changeByEnableSnapshots =
		Math.sign(Number(formData.data.enableSnapshots) - Number(settings.enableSnapshots)) *
		featurePricing.snapshot.price;

	const newCost: number = refreshCost + changeByEnableSnapshots;

	return newCost;
};

export const StockPortfolioSettingsForm: FC<IProps> = ({ className, stockPortfolio, style }) => {
	const classes = useStyles();

	const toaster = useToast();

	const featurePricingResult = useGetFeaturePricingQuery();

	const featurePricing = featurePricingResult.data?.featurePricing;

	const { control, handleSubmit, setError, watch } = useForm<IFormData>({
		defaultValues: {
			data: {
				enableSnapshots: stockPortfolio.settings.enableSnapshots
			}
		},
		validationResolver
	});

	const formFields = watch({ nest: true });

	const [updateSettings] = useUpdateStockPortfolioSettingsMutation({
		onCompleted: () => toaster.show({ intent: "success", message: "Update successful" })
	});

	const onFormSubmitError = useOnFormSubmitError<IFormData>({
		onBadUserInput: (invalidArgs) => setError(invalidArgs)
	});

	const onSubmit = useCallback(
		async (formData: IFormData) => {
			const where = { stockPortfolioId: stockPortfolio.id };
			const { data } = formData;

			try {
				await updateSettings({ variables: { where, data } });
			} catch (err) {
				onFormSubmitError(err);
			}
		},
		[onFormSubmitError, stockPortfolio.id, updateSettings]
	);

	if (!featurePricing) {
		return null;
	}

	const newCost = computeNewCost(stockPortfolio, formFields, featurePricing);

	return (
		<form
			className={classnames(classes.section, className)}
			onSubmit={handleSubmit(onSubmit)}
			style={style}
		>
			<div className={classes.inputsContainer}>
				<Switch
					control={control}
					info={`(${featurePricing.snapshot.price} credits / request)`}
					label="Enable Snapshots"
					name="data.enableSnapshots"
				/>
			</div>
			<Button intent="primary" text="Save settings" type="submit" />
			<p className={classes.costInfo}>
				By saving these options, it will cost{" "}
				<Link href="/pricing">
					<a className={classes.cost}>{newCost} credits</a>
				</Link>{" "}
				for each time data is retrieved for this stock-portfolio
			</p>
		</form>
	);
};
