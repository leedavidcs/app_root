import { FormSelect } from "@/client/components";
import { WebhookType } from "@/client/graphql";
import React, { FC, ReactElement } from "react";
import { Control } from "react-hook-form";

interface IProps {
	control: Control;
	defaultValue?: WebhookType;
	error?: Maybe<string | ReactElement>;
	label?: string;
	name: string;
	placeholder?: string;
}

export const webhookTypes: readonly WebhookType[] = [WebhookType.StockDataRetrieved];

const TypedFormSelect = FormSelect.ofType<WebhookType>();

export const WebhookTypeSelect: FC<IProps> = ({
	control,
	defaultValue,
	error,
	label,
	name,
	placeholder
}) => {
	return (
		<TypedFormSelect
			control={control}
			defaultValue={defaultValue}
			error={error}
			label={label}
			items={webhookTypes}
			name={name}
			placeholder={placeholder}
		/>
	);
};
