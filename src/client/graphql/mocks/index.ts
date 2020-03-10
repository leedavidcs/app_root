import { MockedResponse } from "@apollo/react-testing";
import { CreateStockPortfolioMock } from "./create-stock-portfolio.mock";
import { DeleteStockPortfolioMock } from "./delete-stock-portfolio.mock";
import { GetStockPortfolioCountMock } from "./get-stock-portfolio-count.mock";
import { GetStockPortfoliosForPreviewMock } from "./get-stock-portfolios-for-preview.mock";
import { GetUserMock } from "./get-user.mock";

export const mocks: readonly MockedResponse[] = [
	CreateStockPortfolioMock,
	DeleteStockPortfolioMock,
	GetStockPortfolioCountMock,
	GetStockPortfoliosForPreviewMock,
	GetUserMock
];
