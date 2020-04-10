import { IOrderDetail } from "@/client/components";
import { StripeCard } from "@/client/graphql";
import { PaymentMethodCreateParams } from "@stripe/stripe-js";
import React, { createContext } from "react";

interface IProps {
	billingDetails?: Maybe<PaymentMethodCreateParams.BillingDetails>;
	card?: Maybe<StripeCard>;
	clientSecret?: Maybe<string>;
	orderDetails: readonly IOrderDetail[];
	setBillingDetails?: (billingDetails: Maybe<PaymentMethodCreateParams.BillingDetails>) => void;
	setCard?: (card: Maybe<StripeCard>) => void;
	setClientSecret?: (clientSecret: Maybe<string>) => void;
	setOrderDetails?: (orderDetails: readonly IOrderDetail[]) => void;
}

export const Context: React.Context<IProps> = createContext<IProps>({ orderDetails: [] });

Context.displayName = "CheckoutFormContext";
