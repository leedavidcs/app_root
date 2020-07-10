import { prisma } from "@/server/prisma";
import { NotFoundError } from "@/server/utils";
import { User } from "@prisma/client";

interface IVerifyEmailArgs {
	userId: string;
}

export const verifyEmail = async ({ userId }: IVerifyEmailArgs): Promise<void> => {
	const user: Maybe<User> = await prisma.user.findOne({ where: { id: userId } });

	if (!user) {
		throw new NotFoundError();
	}

	await prisma?.user.update({
		where: { id: userId },
		data: { emailVerified: true }
	});
};
