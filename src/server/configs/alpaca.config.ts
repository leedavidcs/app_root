import Alpaca from "@alpacahq/alpaca-trade-api";

const alpacaApiKey: string = process.env.ALPACA_API_KEY ?? "";
const alpacaSecretKey: string = process.env.ALPACA_SECRET_KEY ?? "";

export const alpaca = new Alpaca({
	keyId: alpacaApiKey,
	secretKey: alpacaSecretKey,
	paper: true,
	usePolygon: false
});
