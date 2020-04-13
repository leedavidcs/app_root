import { ITokenResponse, loginLocal } from "@/server/authentication";
import { BadInputError } from "@/server/utils";
import { arg, inputObjectType, mutationField } from "@nexus/schema";

export const LoginLocalUserInput = inputObjectType({
	name: "LoginLocalUserInput",
	definition: (t) => {
		t.string("userIdentifier", {
			required: true,
			description: "The email or username (either) of the user"
		});
		t.string("password", {
			required: true,
			description: "The user's decrypted password"
		});
	}
});

export const loginLocalUser = mutationField("loginLocalUser", {
	type: "TokenPayload",
	description: "Logins in the user, and returns an expiring access token",
	args: {
		input: arg({
			type: "LoginLocalUserInput",
			required: true
		})
	},
	resolve: async (parent, { input: { password, userIdentifier } }, ctx) => {
		try {
			const tokens: ITokenResponse = await loginLocal({ password, userIdentifier }, ctx);

			return tokens;
		} catch (err) {
			throw new BadInputError(typeof err === "string" ? err : err.message);
		}
	}
});
