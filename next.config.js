const bundleAnalyzer = require("@next/bundle-analyzer");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const nextTranspileModules = require("next-transpile-modules");
const path = require("path");
const flow = require("lodash/flow");

const withTranspileModules = nextTranspileModules(["graphql-language-service-interface/esm"]);
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.BUNDLE_ANALYZE === "true" });

const enhance = flow([withTranspileModules, withBundleAnalyzer]);

const config = {
	target: "experimental-serverless-trace",
	env: {
		PROJECT_DIRNAME: __dirname,
		BRAND_NAME: process.env.BRAND_NAME,
		WEBSITE_URL: process.env.WEBSITE_URL,
		API_BASE_URL: process.env.API_BASE_URL,
		JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
		JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
		JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
		REDIS_AUTH_HOST: process.env.REDIS_AUTH_HOST,
		REDIS_AUTH_PORT: process.env.REDIS_AUTH_PORT,
		REDIS_GRAPHQL_HOST: process.env.REDIS_GRAPHQL_HOST,
		REDIS_GRAPHQL_PORT: process.env.REDIS_GRAPHQL_PORT,
		EMAIL_SENDER_USER: process.env.EMAIL_SENDER_USER,
		EMAIL_SENDER_PASSWORD: process.env.EMAIL_SENDER_PASSWORD,
		IEXCLOUD_API_VERSION: process.env.IEXCLOUD_API_VERSION,
		IEXCLOUD_PUBLIC_KEY: process.env.IEXCLOUD_PUBLIC_KEY,
		IEXCLOUD_SECRET_KEY: process.env.IEXCLOUD_SECRET_KEY,
		IEXCLOUD_SANDBOX_PUBLIC_KEY: process.env.IEXCLOUD_SANDBOX_PUBLIC_KEY,
		IEXCLOUD_SANDBOX_SECRET_KEY: process.env.IEXCLOUD_SANDBOX_SECRET_KEY,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_PUBLISHABLE: process.env.STRIPE_PUBLISHABLE
	},
	webpack: (config, { webpack }) => {
		/** Don't include prettier in the api bundle for graphql */
		config.externals.push("prettier");

		/** PLUGINS */
		/** Reduce Blueprintjs Icons bundle */
		config.plugins.push(new webpack.NormalModuleReplacementPlugin(
			/.*\/generated\/iconSvgPaths.js/,
			path.resolve(__dirname, "generated/icons.generated.ts")
		));
		/** Reduce Lodash bundle */
		config.plugins.push(new LodashModuleReplacementPlugin({
			caching: true,
			memoizing: true,
			paths: true,
			shorthands: true
		}));

		return config;
	}
};

module.exports = enhance(config);
