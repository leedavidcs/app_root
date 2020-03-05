import Cookie from "cookie";
import { IncomingMessage } from "http";

const jwtExpiresIn = Number(process.env.JWT_EXPIRES_IN);
const jwtRefreshExpiresIn = Number(process.env.JWT_REFRESH_EXPIRES_IN);

interface IWriteCookieProps {
	refreshToken?: string;
	sessionOnly?: boolean;
}

export const writeCookie = (
	token: string,
	{ refreshToken, sessionOnly = false }: IWriteCookieProps
): void => {
	document.cookie = Cookie.serialize("token", token, {
		sameSite: true,
		path: "/",
		maxAge: sessionOnly ? undefined : jwtExpiresIn
	});

	if (!refreshToken) {
		return;
	}

	document.cookie = Cookie.serialize("refreshToken", refreshToken, {
		sameSite: true,
		path: "/",
		maxAge: sessionOnly ? undefined : jwtRefreshExpiresIn
	});
};

export const logout = (): void => {
	// Expire the cookies immediately
	document.cookie = Cookie.serialize("token", "", { maxAge: -1 });
	document.cookie = Cookie.serialize("refreshToken", "", { maxAge: -1 });
};

export const getToken = (req?: IncomingMessage): Maybe<string> => {
	const cookies = Cookie.parse(req ? req.headers.cookie || "" : document.cookie);

	return cookies.token || null;
};

export const getRefreshToken = (req?: IncomingMessage): Maybe<string> => {
	const cookies = Cookie.parse(req ? req.headers.cookie || "" : document.cookie);

	return cookies.refreshToken || null;
};
