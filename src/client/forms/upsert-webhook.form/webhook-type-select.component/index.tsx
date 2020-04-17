import { FormSelect } from "@/client/components";
import { WebhookType } from "@/client/graphql";
import React, { FC, memo, ReactElement } from "react";
import { Control } from "react-hook-form";

interface IProps {
	control: Control;
	defaultValue?: WebhookType;
	error?: Maybe<string | ReactElement>;
	inline?: boolean;
	label?: string;
	name: string;
	placeholder?: string;
}

interface IWebhookTypeItem {
	value: WebhookType;
	label: string;
	labelInfo: string;
}

export const webhookTypes: readonly WebhookType[] = [WebhookType.StockDataRetrieved];

const items: readonly IWebhookTypeItem[] = [
	{
		value: WebhookType.StockDataRetrieved,
		label: "Stock data retrieved",
		labelInfo: "Data is refreshed, and new data is loaded"
	}
];

const itemMap = {
	from: (item: IWebhookTypeItem): WebhookType => item.value,
	to: (item: WebhookType): IWebhookTypeItem => {
		return items.find(({ value }) => value.toString() === item.toString())!;
	}
};

const itemInfo = (item: IWebhookTypeItem): string => item.labelInfo;
const itemKey = (item: IWebhookTypeItem): string => item.value.toString();
const itemName = (item: IWebhookTypeItem): string => item.label;

const TypedFormSelect = FormSelect.ofType<WebhookType, IWebhookTypeItem>();

export const WebhookTypeSelect: FC<IProps> = memo(
	({ control, defaultValue, error, inline, label, name, placeholder }) => {
		return (
			<TypedFormSelect
				control={control}
				defaultValue={defaultValue}
				error={error}
				filterable={false}
				label={label}
				inline={inline}
				itemInfo={itemInfo}
				itemKey={itemKey}
				itemMap={itemMap}
				itemName={itemName}
				items={items}
				minimal={true}
				name={name}
				placeholder={placeholder}
				usePortal={false}
			/>
		);
	}
);

WebhookTypeSelect.displayName = "WebhookTypeSelect";
