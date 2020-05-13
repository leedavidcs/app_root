import { oneLine } from "common-tags";
import Document, {
	DocumentContext,
	DocumentInitialProps,
	Head,
	Html,
	Main,
	NextScript
} from "next/document";
import React, { Fragment } from "react";
import { createGenerateId, JssProvider, SheetsRegistry } from "react-jss";

const THEME_SCRIPT = oneLine`
(function() {
	window.__onThemeChange = function() { }

	var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

	var darkQueryUpdate = function(e) {
		document.body.className = e.matches ? "dark" : "light";
	}

	function setTheme(newTheme) {
		window.__theme = newTheme;

		if (newTheme === "system") {
			darkQuery.addListener(darkQueryUpdate);

			document.body.className = (darkQuery.matches ? "dark" : "light");
		} else {
			darkQuery.removeListener(darkQueryUpdate);

			document.body.className = newTheme;
		}

		window.__onThemeChange(newTheme);
	}

	window.__setPreferredTheme = function(newTheme) {
		setTheme(newTheme);
		try {
			localStorage.setItem("theme", newTheme);
		} catch (err) { }
	}

	var initTheme;

	try {
		initTheme = localStorage.getItem("theme");
	} catch (err) { }

	setTheme(initTheme || "system");
})();
`;

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

	render = () => {
		return (
			<Html>
				<Head />
				<body>
					<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	};
}
