import { objectType } from "@nexus/schema";

export const SnapshotHeader = objectType({
	name: "SnapshotHeader",
	definition: (t) => {
		t.string("name", { nullable: false });
		t.string("dataKey");
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

				const headers = snapshot?.headers ?? [];

				return headers as any;
			}
		});
		t.model.data();
	}
});
