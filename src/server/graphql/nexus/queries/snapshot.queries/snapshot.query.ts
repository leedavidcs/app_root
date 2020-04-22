import { arg, inputObjectType, queryField } from "@nexus/schema";

export const SnapshotWhereUniqueInput = inputObjectType({
	name: "SnapshotWhereUniqueInput",
	definition: (t) => {
		t.string("id", { nullable: false });
	}
});

export const snapshot = queryField("snapshot", {
	type: "Snapshot",
	args: {
		where: arg({ type: "SnapshotWhereUniqueInput", nullable: false })
	},
	resolve: (parent, args, { prisma }) => prisma.snapshot.findOne(args)
});
