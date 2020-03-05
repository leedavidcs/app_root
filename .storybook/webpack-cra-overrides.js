const { addWebpackAlias, addWebpackModuleRule, disableEsLint } = require("customize-cra");
const path = require("path");

module.exports = [
	addWebpackAlias({
		"@": path.resolve(__dirname, "../src")
	}),
	addWebpackModuleRule({
		exclude: /node_modules/,
		test: /\.(graphql|gql)$/,
		use: [{ loader: "graphql-tag/loader" }]
	}),
	disableEsLint()
];
