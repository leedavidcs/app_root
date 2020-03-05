import Document, { DocumentContext, DocumentInitialProps } from "next/document";
import React, { Fragment } from "react";
import { createGenerateId, JssProvider, SheetsRegistry } from "react-jss";

export default class extends Document {
	static getInitialProps = async (ctx: DocumentContext) => {
		const registry = new SheetsRegistry();
		const generateId = createGenerateId();
		const originalRenderPage = ctx.renderPage;

		ctx.renderPage = () => {
			return originalRenderPage({
				enhanceApp: (App) => (props) => (
					<JssProvider registry={registry} generateId={generateId}>
						<App {...props} />
					</JssProvider>
				)
			});
		};

		const initialProps: DocumentInitialProps = await Document.getInitialProps(ctx);

		return {
			...initialProps,
			styles: (
				<Fragment>
					{initialProps.styles}
					<style id="server-side-styles">{registry.toString()}</style>
				</Fragment>
			)
		};
	};
}
