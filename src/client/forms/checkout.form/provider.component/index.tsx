import { StripeCard } from "@/client/graphql";
import { IOrderDetail } from "@/client/page-parts";
import { PaymentMethodCreateParams } from "@stripe/stripe-js";
import React, { FC, memo, ReactElement, useMemo, useState } from "react";
import { Context } from "./context";

export * from "./context";

interface IProps {
	children: ReactElement;
}

export const Provider: FC<IProps> = memo(({ children }) => {
	const [billingDetails, setBillingDetails] = useState<
		Maybe<PaymentMethodCreateParams.BillingDetails>
	>(null);
	const [card, setCard] = useState<Maybe<StripeCard>>(null);
	const [clientSecret, setClientSecret] = useState<Maybe<string>>(null);
	const [orderDetails, setOrderDetails] = useState<readonly IOrderDetail[]>([]);

	const value = useMemo(
		() => ({
			billingDetails,
			card,
			clientSecret,
			orderDetails,
			setBillingDetails,
			setCard,
			setClientSecret,
			setOrderDetails
		}),
		[billingDetails, card, clientSecret, orderDetails]
	);

	return <Context.Provider value={value}>{children}</Context.Provider>;
});

Provider.displayName = "CheckoutFormProvider";
