import { objectType } from "@nexus/schema";

export const SnapshotHeader = objectType({
	name: "SnapshotHeader",
	definition: (t) => {
		t.implements("StockPortfolioDataHeader");
	}
});

export const Snapshot = objectType({
	name: "Snapshot",
	definition: (t) => {
		t.model.id();
		t.model.stockPortfolio();
		t.model.tickers();
		t.model.createdAt();
		t.list.field("headers", {
			type: "SnapshotHeader",
			nullable: false,
			resolve: async ({ id }, args, { prisma }) => {
				const snapshot = await prisma.snapshot.findOne({ where: { id } });

				return snapshot?.headers.map((header) => JSON.parse(header)) ?? [];
			}
		});
		t.list.field("data", {
			type: "JSONObject",
			nullable: false,
			resolve: async ({ id }, args, { prisma }) => {
				const snapshot = await prisma.snapshot.findOne({ where: { id } });

				return snapshot?.data.map((datum) => JSON.parse(datum)) ?? [];
			}
		});
	}
});
