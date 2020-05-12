import { timeout } from "blend-promise-utils";
import fetch from "isomorphic-unfetch";
import { NextApiRequest } from "next";
import { getClientIp } from "request-ip";

const REQUEST_TIMEOUT = 5000;

interface IEasyCronIPs {
	ipv4: readonly string[];
	ipv6: readonly string[];
}

export const isEasyCron = async (req: NextApiRequest): Promise<boolean> => {
	let easyCronIPs: IEasyCronIPs;
	try {
		const timeoutFetch = timeout(
			fetch,
			REQUEST_TIMEOUT,
			"Could not resolve isEasyCron within 500ms"
		);

		easyCronIPs = await timeoutFetch("https://www.easycron.com/ips.json").then((response) =>
			response.json()
		);
	} catch (err) {
		/* eslint-disable no-console */
		console.error(err);
		/* eslint-enable no-console */

		return false;
	}

	const clientIp: Maybe<string> = getClientIp(req);

	const isEasyCronIPv4: boolean = easyCronIPs.ipv4.some((ipv4) => clientIp === ipv4);
	const isEasyCronIPv6: boolean = easyCronIPs.ipv6.some((ipv6) => clientIp === ipv6);

	if (!isEasyCronIPv4 && !isEasyCronIPv6) {
		return false;
	}

	if (req.headers["X-EasyCron-Secret"] !== process.env.CRON_SECRET) {
		return false;
	}

	return true;
};
