import { Button, ButtonGroup, Card, NumberInput, TimePicker } from "@/client/components";
import {
	Day,
	Recurrence,
	ScheduledEvent,
	StockPortfolio,
	StockPortfolioEvent as _StockPortfolioEvent,
	StockPortfolioEventType,
	useDeleteDataRetrievedEventMutation,
	useUpsertDataRetrievedEventMutation
} from "@/client/graphql";
import { useToast } from "@/client/hooks";
import { getYupValidationResolver } from "@/client/utils";
import { getHours, getMinutes, set } from "date-fns";
import React, { FC, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { array, date, number, string, StringSchema } from "yup";
import { DaysMultiSelect } from "./days-multi-select.component";
import { RecurrenceSelect } from "./recurrence-select.component";
import { useStyles } from "./styles";

type StockPortfolioEvent = Pick<_StockPortfolioEvent, "type"> & {
	scheduledEvent: Pick<ScheduledEvent, "recurrence" | "days" | "hour" | "interval" | "minute">;
	stockPortfolio: Pick<StockPortfolio, "id">;
};

interface IProps {
	className?: string;
	scheduledEvent?: Maybe<StockPortfolioEvent>;
	stockPortfolio: Pick<StockPortfolio, "id">;
}

interface IFormData {
	interval?: number;
	recurrence?: Recurrence;
	days?: readonly Day[];
	dateTime?: Date;
}

const validationResolver = getYupValidationResolver<IFormData>((data) => {
	const isSchedule = Boolean(data.recurrence || (data.days ?? []).length > 0);

	return {
		interval: number(),
		recurrence: string().test({
			message: "This field is required",
			test: (value) => {
				if (isSchedule && !value) {
					return false;
				}

				return true;
			}
		}) as StringSchema<Recurrence>,
		days: array()
			.of(string<Day>())
			.test({
				message: "Must specify at least 1 day",
				test: (value) => {
					if (
						isSchedule &&
						data.recurrence !== Recurrence.Daily &&
						(value ?? []).length === 0
					) {
						return false;
					}

					return true;
				}
			}),
		dateTime: date()
	};
});

export const SettingPollDataForm: FC<IProps> = ({
	className,
	scheduledEvent: event,
	stockPortfolio
}) => {
	const classes = useStyles();

	const toaster = useToast();

	const defaultTime: Date | undefined = useMemo(() => {
		if (
			typeof event?.scheduledEvent.minute !== "number" &&
			typeof event?.scheduledEvent.hour !== "number"
		) {
			return undefined;
		}

		return set(Date.now(), {
			hours: event?.scheduledEvent.hour ?? 0,
			minutes: event.scheduledEvent.minute ?? 0
		});
	}, [event]);

	const { control, errors, handleSubmit, setValue, watch } = useForm<IFormData>({
		defaultValues: {
			interval: event?.scheduledEvent.interval ?? undefined,
			recurrence: event?.scheduledEvent.recurrence ?? undefined,
			days: event?.scheduledEvent.days,
			dateTime: defaultTime
		},
		validationResolver
	});

	const watched = watch();

	const [deleteEvent] = useDeleteDataRetrievedEventMutation({
		onCompleted: () => toaster.show({ intent: "success", message: "Update successful" })
	});
	const [upsertEvent] = useUpsertDataRetrievedEventMutation({
		onCompleted: () => toaster.show({ intent: "success", message: "Update successful" })
	});

	const onSubmit = useCallback(
		(formData: IFormData) => {
			const type = StockPortfolioEventType.DataRetrieved;

			const hour = formData.dateTime && getHours(formData.dateTime);
			const minute = formData.dateTime && getMinutes(formData.dateTime);

			if (!formData.interval && !formData.recurrence) {
				try {
					deleteEvent({
						variables: {
							where: {
								stockPortfolioId_type: {
									stockPortfolioId: stockPortfolio.id,
									type
								}
							}
						}
					});
				} catch {
					toaster.show({ intent: "danger", message: "Update unsuccessful" });
				}

				return;
			}

			try {
				upsertEvent({
					variables: {
						type,
						interval: formData.interval,
						recurrence: formData.recurrence,
						days: formData.days,
						hour,
						minute,
						stockPortfolioId: stockPortfolio.id
					}
				});
			} catch {
				toaster.show({ intent: "danger", message: "Update unsuccessful" });
			}

			return undefined;
		},
		[deleteEvent, stockPortfolio.id, toaster, upsertEvent]
	);

	const onClickReset = useCallback(() => {
		setValue([
			{ interval: undefined },
			{ recurrence: undefined },
			{ days: undefined },
			{ dateTime: undefined }
		]);
	}, [setValue]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card title="Poll by interval">
				<div className={classes.section}>
					<NumberInput
						control={control}
						disabled={Boolean((watched.days ?? []).length > 0)}
						error={errors.interval?.message}
						label="Poll interval"
						name="interval"
						placeholder="Poll interval"
					/>
				</div>
			</Card>
			<Card className={classes.scheduleCard} title="Poll by schedule">
				<div className={classes.section}>
					<RecurrenceSelect
						control={control}
						disabled={typeof watched.interval === "number"}
						error={errors.recurrence?.message}
						label="Occurs"
						name="recurrence"
						placeholder="Select..."
					/>
					<DaysMultiSelect
						control={control}
						disabled={
							typeof watched.interval === "number" ||
							watched.recurrence !== Recurrence.Weekly
						}
						error={(errors.days as any)?.message}
						label="On days"
						queryPlaceholder="Search..."
						name="days"
					/>
					<TimePicker
						control={control}
						disabled={typeof watched.interval === "number"}
						error={errors.dateTime?.message}
						label="At time"
						name="dateTime"
					/>
				</div>
			</Card>
			<ButtonGroup className={classes.formBtnGroup}>
				<Button intent="primary" text="Save" type="submit" />
				<Button onClick={onClickReset} text="Clear" />
			</ButtonGroup>
		</form>
	);
};
