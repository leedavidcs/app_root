import { schema } from "@/server/webhooks";
import { arg, mutationField } from "@nexus/schema";
import { parse, validate } from "graphql";
import { object, string } from "yup";

export const upsertOneWebhook = mutationField("upsertOneWebhook", {
	type: "Webhook",
	nullable: false,
	args: {
		where: arg({ type: "WebhookWhereUniqueInput", nullable: false }),
		create: arg({ type: "WebhookCreateInput", nullable: false }),
		update: arg({ type: "WebhookUpdateInput", nullable: false })
	},
	authorize: async (parent, { where, create }, { prisma, user }) => {
		if (!user) {
			return false;
		}

		const existing = await prisma.webhook.findOne({
			where,
			include: {
				stockPortfolio: {
					select: {
						userId: true
					}
				}
			}
		});

		const isUnauthorizedUpdate = existing && existing.stockPortfolio.userId !== user.id;

		if (isUnauthorizedUpdate) {
			return false;
		}

		const toConnectPortfolio = await prisma.stockPortfolio.findOne({
			where: create.stockPortfolio.connect
		});

		const isUnauthorizedCreate = toConnectPortfolio && toConnectPortfolio.userId !== user.id;

		if (isUnauthorizedCreate) {
			return false;
		}

		return true;
	},
	yupValidation: () => ({
		create: object().shape({
			url: string().required("Url is required").url("Url is invalid"),
			query: string().test({
				message: "",
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
		}),
		update: object().shape({
			url: string().url("Url is invalid"),
			query: string().test({
				message: "",
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
	resolve: (parent, args, { prisma }) => prisma.webhook.upsert(args)
});
