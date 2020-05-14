import { AuthorizationError } from "@/server/utils";
import { arg, inputObjectType, intArg, queryField } from "@nexus/schema";

export const StockPortfolioWhereUniqueInput = inputObjectType({
	name: "StockPortfolioWhereUniqueInput",
	definition: (t) => {
		t.string("id");
		t.string("name");
	}
});

export const StockPortfolioWhereInput = inputObjectType({
	name: "StockPortfolioWhereInput",
	definition: (t) => {
		t.field("name", { type: "StringFilter" });
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("updatedAt", { type: "DateTimeFilter" });
		t.list.field("AND", { type: "StockPortfolioWhereInput" });
		t.list.field("OR", { type: "StockPortfolioWhereInput" });
		t.list.field("NOT", { type: "StockPortfolioWhereInput" });
	}
});

export const StockPortfolioOrderByInput = inputObjectType({
	name: "StockPortfolioOrderByInput",
	definition: (t) => {
		t.field("name", { type: "OrderByArg" });
		t.field("createdAt", { type: "OrderByArg" });
		t.field("updatedAt", { type: "OrderByArg" });
	}
});

export const stockPortfolio = queryField("stockPortfolio", {
	type: "StockPortfolio",
	args: {
		where: arg({ type: "StockPortfolioWhereUniqueInput" })
	},
	authorize: (parent, args, { webhookOwner }) => Boolean(webhookOwner),
	resolve: async (parent, args, { prisma, webhookOwner }) => {
		const where: any = args.where;

		const result = await prisma.stockPortfolio.findOne({
			where: {
				id: where.id,
				...(where.name && {
					userId_name: {
						userId: webhookOwner!.id,
						name: where.name
					}
				})
			}
		});

		if (result && result.userId !== webhookOwner!.id) {
			throw new AuthorizationError();
		}

		return result;
	}
});

export const stockPortfolios = queryField("stockPortfolios", {
	type: "StockPortfolio",
	list: true,
	nullable: false,
	args: {
		where: arg({ type: "StockPortfolioWhereInput" }),
		skip: intArg(),
		first: intArg(),
		last: intArg(),
		after: arg({ type: "StockPortfolioWhereUniqueInput" }),
		before: arg({ type: "StockPortfolioWhereUniqueInput" }),
		orderBy: arg({ type: "StockPortfolioOrderByInput" })
	},
	authorize: (parent, args, { webhookOwner }) => Boolean(webhookOwner),
	resolve: async (parent, args, { prisma, webhookOwner }) => {
		const { where, ...restArgs } = args as any;

		const result = await prisma.stockPortfolio.findMany({
			...restArgs,
			where: {
				...where,
				userId: { equals: webhookOwner!.id }
			}
		});

		return result as any;
	}
});
