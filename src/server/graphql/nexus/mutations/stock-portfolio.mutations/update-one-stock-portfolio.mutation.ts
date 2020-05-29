import { NexusGenRootTypes } from "@/server/graphql/nexus/generated/typegen.gen";
import { BadInputError, PrismaUtils } from "@/server/utils";
import { arg, inputObjectType, mutationField } from "@nexus/schema";
import { uniqBy } from "lodash";
import { array, object } from "yup";

export const StockPortfolioUpdateInput = inputObjectType({
	name: "StockPortfolioUpdateInput",
	definition: (t) => {
		t.string("name");
		t.list.field("headers", { type: "StockPortfolioHeaderInput" });
		t.list.string("tickers");
	}
});

export const updateOneStockPortfolio = mutationField("updateOneStockPortfolio", {
	type: "StockPortfolio",
	args: {
		data: arg({ type: "StockPortfolioUpdateInput", nullable: false }),
		where: arg({ type: "StockPortfolioWhereUniqueInput", nullable: false })
	},
	rateLimit: () => ({ window: "1m", max: 30 }),
	authorize: async (parent, args, { prisma, user }) => {
		const { where } = PrismaUtils.castInputs(args);

		if (!user) {
			return false;
		}

		const stockPortfolio = await prisma.stockPortfolio.findOne({
			where,
			include: { user: true }
		});

		if (!stockPortfolio) {
			return true;
		}

		const isOwnedByUser: boolean = stockPortfolio.user.id === user.id;

		return isOwnedByUser;
	},
	yupValidation: () => ({
		data: object().shape({
			headers: array<NexusGenRootTypes["StockPortfolioHeader"]>().test({
				message: "Headers must have unique names",
				test: (headers) => {
					const hasUniqNames: boolean = uniqBy(headers, "name").length === headers.length;

					return hasUniqNames;
				}
			})
		})
	}),
	resolve: async (parent, args, { dataSources, prisma }) => {
		const {
			data: { name, headers, tickers },
			where
		} = PrismaUtils.castInputs(args);

		const { IexCloudAPI } = dataSources;

		if (tickers) {
			const areTickersValid: boolean = await IexCloudAPI.areSymbolsValid(tickers);

			if (!areTickersValid) {
				throw new BadInputError("Tickers are invalid.");
			}
		}

		const stockPortfolio = await prisma.stockPortfolio.update({
			data: {
				name,
				tickers: { set: tickers },
				...(headers && {
					headers: { set: headers.map((header) => JSON.stringify(header)) }
				})
			},
			where
		});

		return stockPortfolio;
	}
});
