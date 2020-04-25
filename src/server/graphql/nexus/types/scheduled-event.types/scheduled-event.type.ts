import { objectType } from "@nexus/schema";

export const ScheduledEvent = objectType({
	name: "ScheduledEvent",
	definition: (t) => {
		t.model.id();
		t.model.user();
		t.model.days();
		t.model.hour();
		t.model.minute();
		t.model.interval();
		t.model.timezone();
		t.model.next();
		t.field("stockPortfolioEvent", {
			type: "StockPortfolioEvent",
			resolve: ({ id }, args, { prisma }) => {
				return prisma.stockPortfolioEvent.findOne({
					where: { scheduledEventId: id }
				});
			}
		});
	}
});
