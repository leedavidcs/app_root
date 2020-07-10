import { objectType } from "@nexus/schema";

export const User = objectType({
	name: "User",
	description: "Basic user of the application",
	definition: (t) => {
		t.model.id();
		t.field("email", { type: "EmailAddress", nullable: false });
		t.model.emailVerified();
		t.model.username();
		t.field("balance", {
			type: "Balance",
			authorize: ({ id }, args, { user }) => {
				if (!user || user.id !== id) {
					return false;
				}

				return true;
			},
			resolve: async ({ id }, args, { prisma }) => {
				return prisma.balance.findOne({ where: { userId: id } });
			}
		});
		t.model.stockPortfolios();
		t.model.timezone();
		t.model.createdAt();
		t.model.updatedAt();
	}
});
