import { arg, queryField } from "@nexus/schema";

export const snapshotCount = queryField("snapshotCount", {
	type: "Int",
	nullable: false,
	args: {
		where: arg({ type: "SnapshotWhereInput" })
	},
	resolve: (parent, args, { prisma }) => prisma.snapshot.count(args)
});
