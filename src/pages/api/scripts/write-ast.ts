import { makeStockSchema } from "@/scripts/generate-stock-schema.script";
import HttpStatus from "http-status-codes";
import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
	if (process.env.ENABLE_SCRIPTS !== "true") {
		res.status(HttpStatus.FORBIDDEN);
		res.end();

		return;
	}

	makeStockSchema({ shouldGenerateArtifacts: true });

	res.status(HttpStatus.OK);
	res.end();
};
