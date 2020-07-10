import { applyGenerators, stringFilter } from "@/server/prisma";
import { PrismaUtils } from "@/server/utils";
import { arg, extendType, intArg, stringArg } from "@nexus/schema";

export const stockPortfolioQueries = extendType({
	type: "Query",
	definition: (t) => {
		t.crud.stockPortfolio();
		t.crud.stockPortfolios({ filtering: true, ordering: true });
		t.list.field("stockPortfolios", {
			type: "StockPortfolio",
			nullable: false,
			rateLimit: () => ({ window: "1m", max: 30 }),
			args: {
				cursor: arg({ type: "StockPortfolioWhereUniqueInput" }),
				take: intArg(),
				skip: intArg(),
				orderBy: arg({ type: "StockPortfolioOrderByInput" }),
				where: arg({ type: "StockPortfolioWhereInput" }),
				query: stringArg()
			},
			resolve: async (parent, args, { prisma }) => {
				const { query, where, ...paginationArgs } = PrismaUtils.castInputs(args);

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
