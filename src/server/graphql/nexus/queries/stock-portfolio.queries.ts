import { applyGenerators, stringFilter } from "@/server/prisma";
import { arg, extendType, intArg, queryField, stringArg } from "nexus";

export const stockPortfolioQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.stockPortfolio();
		t.crud.stockPortfolios({ filtering: true, ordering: true });
		t.int("stockPortfolioCount", {
			args: {
				where: arg({ type: "StockPortfolioHeaderWhereInput" }),
				query: stringArg()
			},
			resolve: async (parent, { query, where }, { prisma }) => {
				const result = await prisma.stockPortfolio.findMany({
					where: applyGenerators(where, [stringFilter("name", query)])
				});

				const count: number = result.length;

				return count;
			}
		});
	}
});

export const stockPortfolios = queryField("stockPortfolios", {
	type: "StockPortfolio",
	list: true,
	nullable: false,
	args: {
		after: arg({ type: "StockPortfolioWhereUniqueInput" }),
		before: arg({ type: "StockPortfolioWhereUniqueInput" }),
		first: intArg(),
		last: intArg(),
		skip: intArg(),
		orderBy: arg({ type: "StockPortfolioOrderByInput" }),
		where: arg({ type: "StockPortfolioWhereInput" }),
		query: stringArg()
	},
	resolve: async (parent, args, { prisma }) => {
		const { query, where, ...paginationArgs } = args;

		const result = await prisma.stockPortfolio.findMany({
			...paginationArgs,
			where: applyGenerators(where, [stringFilter("name", query)])
		});

		return result;
	}
});
