import { applyGenerators, stringFilter } from "@/server/prisma";
import { arg, extendType, intArg, stringArg } from "@nexus/schema";

export const stockPortfolioQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.stockPortfolio();
		t.crud.stockPortfolios({ filtering: true, ordering: true });
		t.field("stockPortfolios", {
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

				return prisma.stockPortfolio.findMany({
					...paginationArgs,
					where: applyGenerators(where, [stringFilter("name", query)])
				});
			}
		});
		t.int("stockPortfolioCount", {
			args: {
				where: arg({ type: "StockPortfolioWhereInput" }),
				query: stringArg()
			},
			resolve: async (parent, { query, where }, { prisma }) => {
				const count = await prisma.stockPortfolio.count({
					where: applyGenerators(where, [stringFilter("name", query)])
				});

				return count;
			}
		});
	}
});
