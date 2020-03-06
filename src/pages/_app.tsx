import {
	ClickOutsideProvider,
	GlobalStyles,
	JssProvider,
	ModalProvider
} from "@/client/components";
import { withApollo } from "@/client/hocs";
import { Layout } from "@/client/page-parts/_app.page-parts";
import "@blueprintjs/core/lib/css/blueprint.css";
import { flow } from "lodash";
import App from "next/app";
import Head from "next/head";
import { withRouter } from "next/router";
import React, { Fragment } from "react";

const compose = flow(withRouter, withApollo());

export default compose(
	class extends App {
		static getInitialProps: typeof App.getInitialProps = async ({ Component, ctx }) => {
			return { pageProps: await Component.getInitialProps?.(ctx) };
		};

		componentDidMount = () => {
			const style = document.getElementById("server-side-styles");

			style?.parentNode?.removeChild(style);
		};

		render = () => {
			const { Component, pageProps, router } = this.props;

			return (
				<Fragment>
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
						<meta
							property="og:url"
							content={`${process.env.WEBSITE_URL}${router.asPath}`}
						/>
						<link rel="shortcut icon" href="/favicon.ico" />
					</Head>
					<JssProvider>
						<GlobalStyles>
							<ClickOutsideProvider>
								<ModalProvider>
									<Layout>
										<Component {...pageProps} />
									</Layout>
								</ModalProvider>
							</ClickOutsideProvider>
						</GlobalStyles>
					</JssProvider>
				</Fragment>
			);
		};
	}
);
