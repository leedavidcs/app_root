import { ClickOutsideProvider, ModalProvider, StylesProvider } from "@/client/components";
import { MockApollo } from "@/client/graphql";
import { DecoratorFunction } from "@storybook/addons";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { ReactElement } from "react";
import { MockNextRouter } from "./mock-next-router.component";

const stripePublishable: string = process.env.STRIPE_PUBLISHABLE || "";
const stripePromise = loadStripe(stripePublishable);

export const withRootProvider: DecoratorFunction<ReactElement> = (getStory) => {
	return (
		<Elements stripe={stripePromise}>
			<MockNextRouter>
				<MockApollo>
					<StylesProvider style={{ padding: "0 25px" }}>
						<ClickOutsideProvider>
							<ModalProvider>{getStory()}</ModalProvider>
						</ClickOutsideProvider>
					</StylesProvider>
				</MockApollo>
			</MockNextRouter>
		</Elements>
	);
};
