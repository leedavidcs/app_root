const bundleAnalyzer = require("@next/bundle-analyzer");

const enhance = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const config = {
	target: "serverless",
	env: {
		PROJECT_DIRNAME: __dirname,
		BRAND_NAME: process.env.BRAND_NAME,
		WEBSITE_URL: process.env.WEBSITE_URL,
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
		REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
		REACT_APP_STRIPE_PUBLISHABLE: process.env.REACT_APP_STRIPE_PUBLISHABLE
	}
};

module.exports = enhance(config);
