import { ClickOutsideProvider, StylesProvider } from "@/client/components";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "codemirror/theme/lesser-dark.css";
import "graphiql/graphiql.min.css";
import { NextComponentType } from "next";
import { AppInitialProps, AppProps } from "next/app";
import { AppContext } from "next/dist/pages/_app";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect } from "react";

const stripePublishable: string = process.env.STRIPE_PUBLISHABLE || "";
const stripePromise = loadStripe(stripePublishable);

const App: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
	Component,
	pageProps
}) => {
	const router: NextRouter = useRouter();

	useEffect(() => {
		const style = document.getElementById("server-side-styles");

		style?.parentNode?.removeChild(style);
	}, []);

	return (
		<>
			<Head>
				<title key="title">The Brand Inc.</title>
				<meta
					key="description"
					name="description"
					content="We provide you the tools to build and manage your portfolios"
				/>
				<meta key="og:type" property="og:type" content="website" />
				<meta
					key="og:title"
					property="og:title"
					content="We provide you the tools to build and manage your portfolios"
				/>
				<meta
					key="og:description"
					name="og:description"
					content="We provide you the tools to build and manage your portfolios"
				/>
				<meta property="og:url" content={`${process.env.WEBSITE_URL}${router.asPath}`} />
				<link rel="shortcut icon" href="/favicon.ico" />
			</Head>
			<Elements stripe={stripePromise}>
				<StylesProvider>
					<ClickOutsideProvider>
						<Component {...pageProps} />
					</ClickOutsideProvider>
				</StylesProvider>
			</Elements>
		</>
	);
};

export default App;
