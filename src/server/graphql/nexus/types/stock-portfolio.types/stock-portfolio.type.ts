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
		t.model.userId();
		t.model.name();
		t.model.buyingPower();
		t.field("settings", {
			type: "StockPortfolioSettings",
			nullable: false,
			authorize: ({ userId }, args, { user }) => {
				if (!user || user.id !== userId) {
					return false;
				}

				return true;
			},
			resolve: async ({ id }, args, { prisma }) => {
				const settings = await prisma.stockPortfolioSettings.findOne({
					where: { stockPortfolioId: id }
				});

				if (!settings) {
					throw new NotFoundError("Settings could not be found");
				}

				return settings;
			}
		});
		t.model.tickers();
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
				const latestSnapshot = await prisma.latestSnapshot.findOne({
					where: {
						stockPortfolioId: id
					},
					include: {
						snapshot: true
					}
				});

				return latestSnapshot?.snapshot ?? null;
			}
		});
		t.list.field("orders", {
			type: "Order",
			nullable: false,
			args: {
				where: arg({ type: "OrderWhereInput" }),
				orderBy: arg({ type: "OrderOrderByInput" }),
				skip: intArg(),
				after: arg({ type: "OrderWhereUniqueInput" }),
				before: arg({ type: "OrderWhereUniqueInput" }),
				first: intArg(),
				last: intArg()
			},
			resolve: async (
				{ id },
				{ where, orderBy, skip, after, before, first, last },
				{ prisma, user }
			) => {
				return await prisma.order.findMany({
					where: {
						...where,
						stockPortfolio: {
							...where?.stockPortfolio,
							id
						}
					},
					orderBy,
					skip,
					after,
					before,
					first,
					last
				});
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
