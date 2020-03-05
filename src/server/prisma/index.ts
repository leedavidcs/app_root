import { PrismaClient } from "@prisma/client";

const isDebug: boolean = process.env.NODE_ENV !== "production";

export const prisma = new PrismaClient({
	debug: isDebug,
	log: isDebug ? ["info", "query", "warn"] : []
});
