import { NumberInput, Switch } from "@/client/components";
import {
	FeaturePricing as _FeaturePricing,
	StockData,
	StockPortfolio as _StockPortfolio,
	StockPortfolioSettings,
	useGetFeaturePricingQuery,
	useUpdateStockPortfolioSettingsMutation
} from "@/client/graphql";
import { useOnFormSubmitError } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import classnames from "classnames";
import ms from "ms";
import React, { CSSProperties, FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { boolean, number, object } from "yup";
import { useStyles } from "./styles";

type StockPortfolio = Pick<_StockPortfolio, "id"> & {
	stockData: Pick<StockData, "refreshCost">;
	settings: Pick<StockPortfolioSettings, "enableSnapshots" | "pollInterval">;
};
type FeaturePricing = Pick<_FeaturePricing, "snapshot">;

const MS_PER_MINUTE: number = ms("1m");
const CRON_INTERVAL: string = process.env.CRON_INTERVAL ?? "20m";
const MS_CRON_INTERVAL: number = ms(CRON_INTERVAL);

interface IProps {
	className?: string;
	stockPortfolio: StockPortfolio;
	style?: CSSProperties;
}

interface IFormData {
	data: {
		enableSnapshots: boolean;
		pollInterval: number;
	};
}

const validationResolver = getYupValidationResolver<IFormData>(() => ({
	data: object().shape({
		enableSnapshots: boolean(),
		pollInterval: number()
			.min(0, "Poll Interval must be at least 0")
			.test({
				message: `Poll Interval must be in intervals of ${CRON_INTERVAL}`,
				test: (value) => {
					const inMs: number = value * MS_PER_MINUTE;

					return inMs === 0 || inMs % MS_CRON_INTERVAL === 0;
				}
			})
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

	const featurePricingResult = useGetFeaturePricingQuery();

	const featurePricing = featurePricingResult.data?.featurePricing;

	const { control, errors, handleSubmit, setError, watch } = useForm<IFormData>({
		defaultValues: {
			data: {
				enableSnapshots: stockPortfolio.settings.enableSnapshots,
				pollInterval: stockPortfolio.settings.pollInterval
			}
		},
		validationResolver
	});

	const formFields = watch({ nest: true });

	const [updateSettings] = useUpdateStockPortfolioSettingsMutation();

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
				<NumberInput
					control={control}
					error={errors["data.pollInterval"]?.message}
					label="Poll Interval"
					labelInfo="(minutes)"
					name="data.pollInterval"
					stepSize={MS_CRON_INTERVAL / MS_PER_MINUTE}
				/>
			</div>
			<Button intent="primary" text="Save settings" type="submit" />
			<p className={classes.costInfo}>
				By saving these options, it will cost{" "}
				<strong className={classes.cost}>{newCost} credits</strong>{" "}
				{formFields.data.pollInterval > 0
					? `every ${formFields.data.pollInterval} minutes, when`
					: "for each time"}{" "}
				data is retrieved for this stock-portfolio
			</p>
		</form>
	);
};
