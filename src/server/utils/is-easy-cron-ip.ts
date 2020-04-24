import fetch from "isomorphic-unfetch";
import { NextApiRequest } from "next";
import { getClientIp } from "request-ip";

interface IEasyCronIPs {
	ipv4: readonly string[];
	ipv6: readonly string[];
}

export const isEasyCronIP = async (req: NextApiRequest): Promise<boolean> => {
	const easyCronIPs: IEasyCronIPs = await fetch(
		"https://https://www.easycron.com/ips.json"
	).then((response) => response.json());

	const clientIp: Maybe<string> = getClientIp(req);

	const isEasyCronIPv4: boolean = easyCronIPs.ipv4.some((ipv4) => clientIp === ipv4);
	const isEasyCronIPv6: boolean = easyCronIPs.ipv6.some((ipv6) => clientIp === ipv6);

	if (!isEasyCronIPv4 && !isEasyCronIPv6) {
		return false;
	}

	return true;
};
