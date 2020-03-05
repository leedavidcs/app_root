import { ITokenResponse } from "@/server/authentication";
import { issueTokens } from "@/server/authentication/jwt-utils";
import { IServerContext, IServerContextWithUser } from "@/server/graphql";
import { User } from "@prisma/client";
import BCrypt from "bcryptjs";

interface ILoginLocalArgs {
	password: string;
	userIdentifier: string;
}

const getUserByEmailOrUsername = async (
	userIdentifier: string,
	context: IServerContext
): Promise<Maybe<User>> => {
	const { prisma } = context;

	const userByEmail: Maybe<User> = await prisma.user.findOne({
		where: { email: userIdentifier }
	});

	const user: Maybe<User> =
		userByEmail ?? (await prisma?.user.findOne({ where: { username: userIdentifier } }));

	return user;
};

export const loginLocal = async (
	{ password, userIdentifier }: ILoginLocalArgs,
	context: IServerContextWithUser
): Promise<ITokenResponse> => {
	const user: Maybe<User> = await getUserByEmailOrUsername(userIdentifier, context);

	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isCorrectPassword: boolean = BCrypt.compareSync(password, user.password);

	if (!isCorrectPassword) {
		throw new Error("Invalid credentials");
	}

	return issueTokens(user.id);
};
