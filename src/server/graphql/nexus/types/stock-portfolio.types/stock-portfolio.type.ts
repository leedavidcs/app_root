import { NotFoundError } from "@/server/utils";
import { arg, intArg, objectType } from "@nexus/schema";

export const StockPortfolioHeader = objectType({
	name: "StockPortfolioHeader",
	definition: (t) => {
		t.implements("StockPortfolioDataHeader");
		t.boolean("frozen", { nullable: false });
		t.boolean("resizable", { nullable: false });
		t.int("width", { nullable: false });
	}
});

export const StockPortfolio = objectType({
	name: "StockPortfolio",
	description: "StockPortfolio entity. This is what gets shown on the data grid",
	definition: (t) => {
		t.model.id();
		t.model.user();
		t.model.name();
		t.list.field("headers", {
			type: "StockPortfolioHeader",
			nullable: false,
			resolve: async ({ id }, args, { prisma }) => {
				const stockPortfolio = await prisma.stockPortfolio.findOne({ where: { id } });

				const parsedHeaders = (stockPortfolio?.headers || []).map((header) =>
					JSON.parse(header)
				);

				return parsedHeaders;
			}
		});
		t.model.tickers();
		t.model.settings();
		t.field("stockData", {
			type: "StockData",
			nullable: false,
			description: "The data that gets resolved based on headers and tickers",
			resolve: async ({ id }, args, { prisma }) => {
				const stockPortfolio = await prisma.stockPortfolio.findOne({ where: { id } });

				if (!stockPortfolio) {
					throw new NotFoundError();
				}

				return { stockPortfolio };
			}
		});
		t.field("latestSnapshot", {
			type: "Snapshot",
			resolve: async ({ id }, args, { prisma }) => {
				const snapshots = await prisma.snapshot.findMany({
					where: {
						stockPortfolioId: id
					},
					first: 1,
					orderBy: {
						createdAt: "desc"
					}
				});

				return snapshots.length > 0 ? snapshots[0] : null;
			}
		});
		t.list.field("snapshots", {
			type: "Snapshot",
			nullable: false,
			args: {
				where: arg({ type: "SnapshotWhereInput" }),
				orderBy: arg({ type: "SnapshotOrderByInput" }),
				skip: intArg(),
				after: arg({ type: "SnapshotWhereUniqueInput" }),
				before: arg({ type: "SnapshotWhereUniqueInput" }),
				first: intArg(),
				last: intArg()
			},
			resolve: async (
				{ id },
				{ where, orderBy, skip, after, before, first, last },
				{ prisma }
			) => {
				const snapshots = await prisma.snapshot.findMany({
					where: {
						...where,
						stockPortfolioId: id
					},
					orderBy,
					skip,
					after,
					before,
					first,
					last
				});

				return snapshots;
			}
		});
		t.model.createdAt();
		t.model.updatedAt();
	}
});
