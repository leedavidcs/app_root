import { AuthorizationError } from "@/server/utils";
import { arg, inputObjectType, intArg, queryField } from "@nexus/schema";

export const SnapshotWhereUniqueInput = inputObjectType({
	name: "SnapshotWhereUniqueInput",
	definition: (t) => {
		t.string("id");
	}
});

export const SnapshotWhereInput = inputObjectType({
	name: "SnapshotWhereInput",
	definition: (t) => {
		t.field("createdAt", { type: "DateTimeFilter" });
		t.field("stockPortfolio", { type: "StockPortfolioWhereInput" });
		t.list.field("AND", { type: "SnapshotWhereInput" });
		t.list.field("OR", { type: "SnapshotWhereInput" });
		t.list.field("NOT", { type: "SnapshotWhereInput" });
	}
});

export const SnapshotOrderByInput = inputObjectType({
	name: "SnapshotOrderByInput",
	definition: (t) => {
		t.field("createdAt", { type: "OrderByArg" });
	}
});

export const snapshot = queryField("snapshot", {
	type: "Snapshot",
	args: {
		where: arg({ type: "SnapshotWhereUniqueInput", nullable: false })
	},
	authorize: (parent, args, { webhookOwner }) => Boolean(webhookOwner),
	resolve: async (parent, args, { prisma, webhookOwner }) => {
		const where: any = args.where;

		const result = await prisma.snapshot.findOne({
			where,
			include: {
				stockPortfolio: {
					select: {
						userId: true
					}
				}
			}
		});

		if (result && result.stockPortfolio.userId !== webhookOwner!.id) {
			throw new AuthorizationError();
		}

		return result as any;
	}
});

export const snapshots = queryField("snapshots", {
	type: "Snapshot",
	list: true,
	nullable: false,
	args: {
		where: arg({ type: "SnapshotWhereInput" }),
		orderBy: arg({ type: "SnapshotOrderByInput" }),
		skip: intArg(),
		first: intArg(),
		last: intArg(),
		after: arg({ type: "SnapshotWhereUniqueInput" }),
		before: arg({ type: "SnapshotWhereUniqueInput" })
	},
	authorize: (parent, args, { webhookOwner }) => Boolean(webhookOwner),
	resolve: async (parent, args, { prisma, webhookOwner }) => {
		const { where, ...restArgs } = args as any;

		const result = await prisma.snapshot.findMany({
			...restArgs,
			where: {
				...where,
				stockPortfolio: {
					...where?.stockPortfolio,
					userId: { equals: webhookOwner!.id }
				}
			}
		});

		return result as any;
	}
});
