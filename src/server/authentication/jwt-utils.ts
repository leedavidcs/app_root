import { getRefreshTokenUserId, saveRefreshToken } from "@/server/redis";
import { User } from "@prisma/client";
import Jwt, { Algorithm } from "jsonwebtoken";
import { NextApiRequest } from "next";

export interface IWithUser {
	user: User | null;
}

const CONVERSION_UNIX_TIME = 1000;
const JWT_SIGN_ALGORITHM: Algorithm = "HS256";

const jwtExpiresIn = Number(process.env.JWT_EXPIRES_IN);
const jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";
const jwtRefreshExpiresIn = Number(process.env.JWT_REFRESH_EXPIRES_IN);
const jwtRefreshSecretKey: string = process.env.JWT_REFRESH_SECRET_KEY || "";

export interface ITokenResponse {
	refreshToken: string;
	token: string;
}

interface IJwtPayload {
	userId: string;
}

const getAuthorizationHeader = (req: NextApiRequest): Maybe<string> => {
	const headerKeys: readonly string[] = Object.keys(req.headers);
	const authKey = headerKeys.find((key) => key.toLowerCase() === "authorization");

	const authHeader: Maybe<string> = authKey ? req.headers.authorization : null;

	return authHeader;
};

const getBearerToken = (req: NextApiRequest): string | null => {
	const bearerHeader: Maybe<string> = getAuthorizationHeader(req);

	const token: string | null =
		typeof bearerHeader === "string" ? bearerHeader.split(" ")[1] : null;

	return token;
};

const verifyBearerToken = (token: string): IJwtPayload => {
	const decoded = Jwt.verify(token, jwtSecretKey) as IJwtPayload;

	return decoded;
};

const getAccessToken = (userId: string): string => {
	const token: string = Jwt.sign({ userId }, jwtSecretKey, {
		algorithm: JWT_SIGN_ALGORITHM,
		expiresIn: Math.floor(Date.now() / CONVERSION_UNIX_TIME) + jwtExpiresIn
	});

	return token;
};

const getRefreshToken = (userId: string): string => {
	const refreshToken: string = Jwt.sign({ userId }, jwtRefreshSecretKey, {
		algorithm: JWT_SIGN_ALGORITHM,
		expiresIn: Math.floor(Date.now() / CONVERSION_UNIX_TIME) + jwtRefreshExpiresIn
	});

	saveRefreshToken(refreshToken, userId);

	return refreshToken;
};

const getUserFromBearerToken = (bearerToken: string): string => {
	const result: IJwtPayload = verifyBearerToken(bearerToken);

	const { userId } = result;

	return userId;
};

export const issueTokens = (userId: string): ITokenResponse => {
	const refreshToken: string = getRefreshToken(userId.toString());
	const accessToken: string = getAccessToken(userId.toString());

	const tokenResponse: ITokenResponse = {
		refreshToken,
		token: accessToken
	};

	return tokenResponse;
};

export const getAuthorizedUserId = (req: NextApiRequest): string | null => {
	const bearerToken: string | null = getBearerToken(req);

	const userId: string | null = bearerToken ? getUserFromBearerToken(bearerToken) : null;

	return userId;
};

export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
	try {
		const userId = await getRefreshTokenUserId(refreshToken);

		const accessToken: string = getAccessToken(userId.toString());

		return accessToken;
	} catch (err) {
		return null;
	}
};
