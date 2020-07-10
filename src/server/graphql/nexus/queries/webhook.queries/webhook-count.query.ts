import { PrismaUtils } from "@/server/utils";
import { arg, queryField } from "@nexus/schema";

export const webhookCount = queryField("webhookCount", {
	type: "Int",
	nullable: false,
	args: {
		where: arg({ type: "WebhookWhereInput" })
	},
	authorize: (parent, args, { user }) => {
		if (!user) {
			return false;
		}

		return true;
	},
	resolve: async (parent, args, { prisma, user }) => {
		const casted = PrismaUtils.castInputs(args);

		return prisma.webhook.count({
			where: {
				...casted.where,
				stockPortfolio: {
					...casted.where?.stockPortfolio,
					userId: { equals: user.id }
				}
			}
		});
	}
});
