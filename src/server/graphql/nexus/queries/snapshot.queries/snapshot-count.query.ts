import { PrismaUtils } from "@/server/utils";
import { arg, queryField } from "@nexus/schema";

export const snapshotCount = queryField("snapshotCount", {
	type: "Int",
	nullable: false,
	args: {
		where: arg({ type: "SnapshotWhereInput" })
	},
	resolve: (parent, args, { prisma }) => {
		const casted = PrismaUtils.castInputs(args);

		return prisma.snapshot.count(casted);
	}
});
