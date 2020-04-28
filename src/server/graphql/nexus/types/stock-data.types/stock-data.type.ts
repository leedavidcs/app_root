import { NotFoundError } from "@/server/utils";
import { booleanArg, objectType } from "@nexus/schema";
import { oneLine } from "common-tags";

export const StockData = objectType({
	name: "StockData",
	description: oneLine`
		The data for a stock-portfolio, derived from its headers and tickers. Accessing the \`data\`
		prop of this type will incur a transaction for the \`viewer\` of this request
	`,
	definition: (t) => {
		t.field("stockPortfolio", {
			type: "StockPortfolio",
			nullable: false,
			description: oneLine`
				The stock portfolio for which this data is being generated for. If provided, \
				snapshots may be created depending on the stock-portfolio's settings.
			`
		});
		t.int("refreshCost", {
			description: "The amount in credits, that a data-refresh would cost",
			nullable: false,
			args: {
				enableSnapshots: booleanArg()
			},
			resolve: async ({ stockPortfolio: { id } }, args, { dataSources, prisma }) => {
				const { IexCloudAPI } = dataSources;

				const stockPortfolio = await prisma.stockPortfolio.findOne({
					where: { id },
					include: { settings: true }
				});

				if (!stockPortfolio) {
					throw new NotFoundError();
				}

				const cost: number = IexCloudAPI.computeCosts(stockPortfolio);

				return cost;
			}
		});
		t.list.field("data", {
			type: "JSONObject",
			list: true,
			description: oneLine`
				The data for this stock-portfolio. Accessing this property incurs a transaction for
				the viewer of this request
			`,
			authorize: (parent, args, { user }) => Boolean(user),
			/**
			 * @description With complexity = 300 and maxComplexity = 500, data can be requested
			 *     once per request
			 * @author David Lee
			 * @date April 23, 2020
			 */
			complexity: 300,
			resolve: ({ stockPortfolio }, arg, { dataSources, user }) => {
				const { IexCloudAPI } = dataSources;

				return IexCloudAPI.getStockPortfolioData(stockPortfolio, user);
			}
		});
	}
});
