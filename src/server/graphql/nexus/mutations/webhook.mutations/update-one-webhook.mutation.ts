import { PrismaUtils } from "@/server/utils";
import { schema } from "@/server/webhooks";
import { arg, inputObjectType, mutationField } from "@nexus/schema";
import { AuthenticationError, ForbiddenError } from "apollo-server-micro";
import { parse, validate } from "graphql";
import { object, string } from "yup";

export const WebhookUpdateInput = inputObjectType({
	name: "WebhookUpdateInput",
	definition: (t) => {
		t.field("type", { type: "WebhookType" });
		t.string("query");
		t.string("secret");
		t.string("url");
		t.int("timeout");
	}
});

export const updateOneWebhook = mutationField("updateOneWebhook", {
	type: "Webhook",
	args: {
		where: arg({ type: "WebhookWhereUniqueInput", nullable: false }),
		data: arg({ type: "WebhookUpdateInput", nullable: false })
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	authorize: async (parent, args, { prisma, user }) => {
		const { where } = PrismaUtils.castInputs(args);

		if (!user) {
			return new AuthenticationError("This request requires authentication");
		}

		const webhook = await prisma.webhook.findOne({
			where,
			include: { stockPortfolio: true }
		});

		if (webhook?.stockPortfolio.userId !== user.id) {
			return new ForbiddenError(
				"Cannot update a webhook for a stock portfolio belonging to a different user"
			);
		}

		return true;
	},
	yupValidation: (parent) => ({
		data: object().shape({
			url: string().url("Url is invalid"),
			query: string().test({
				message: "Query is invalid",
				test: (query) => {
					try {
						const parsed = parse(query);
						const errors = validate(schema, parsed);

						const isValid = errors.length === 0;

						return isValid;
					} catch {
						return false;
					}
				}
			})
		})
	}),
	resolve: (parent, args, { prisma }) => {
		const casted = PrismaUtils.castInputs(args);

		return prisma.webhook.update(casted);
	}
});
