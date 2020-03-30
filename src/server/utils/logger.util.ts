import Winston, { createLogger, transports } from "winston";

export const Logger: Winston.Logger = createLogger({
	silent: process.env.NODE_ENV !== "production",
	transports: [new transports.Console()]
});
