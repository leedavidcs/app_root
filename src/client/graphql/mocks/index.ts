import { MockedResponse } from "@apollo/react-testing";
import { DeleteStockPortfolioMock } from "./delete-stock-portfolio.mock";
import { GetStockPortfoliosForPreviewMock } from "./get-stock-portfolios-for-preview.mock";

export const mocks: readonly MockedResponse[] = [
	DeleteStockPortfolioMock,
	GetStockPortfoliosForPreviewMock
];
