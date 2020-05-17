const {
	addWebpackAlias,
	addWebpackModuleRule,
	addWebpackPlugin,
	disableEsLint
} = require("customize-cra");
const path = require("path");
const { EnvironmentPlugin } = require("webpack");

module.exports = [
	addWebpackAlias({
		"@": path.resolve(__dirname, "../src")
	}),
	addWebpackModuleRule({
		exclude: /node_modules/,
		test: /\.(graphql|gql)$/,
		use: [{ loader: "graphql-tag/loader" }]
	}),
	addWebpackPlugin(new EnvironmentPlugin({
		IS_STORYBOOK: "true"
	})),
	disableEsLint()
];
