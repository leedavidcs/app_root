import { MockedResponse } from "@apollo/react-testing";
import { CreateStockPortfolioMock } from "./create-stock-portfolio.mock";
import { CreateStripeSetupIntentMock } from "./create-stripe-setup-intent.mock";
import { DeleteStockPortfolioMock } from "./delete-stock-portfolio.mock";
import { GetDataKeyOptionsMock } from "./get-data-key-options.mock";
import { GetFeaturePricingMock } from "./get-feature-pricing.mock";
import { GetManyStockPortfoliosMock } from "./get-many-stock-portfolios.mock";
import { GetOneStockPortfolioMocks } from "./get-one-stock-portfolio.mock";
import { GetPriceBundlesMock } from "./get-price-bundles.mock";
import { GetStockPortfolioEventMock } from "./get-stock-portfolio-event.mock";
import { GetUserMock } from "./get-user.mock";
import { SearchStockSymbolsMock } from "./search-stock-symbols.mock";

export * from "./create-stock-portfolio.mock";
export * from "./create-stripe-setup-intent.mock";
export * from "./delete-stock-portfolio.mock";
export * from "./get-data-key-options.mock";
export * from "./get-feature-pricing.mock";
export * from "./get-many-stock-portfolios.mock";
export * from "./get-one-stock-portfolio.mock";
export * from "./get-price-bundles.mock";
export * from "./get-stock-portfolio-event.mock";
export * from "./get-user.mock";
export * from "./search-stock-symbols.mock";

export const mocks: readonly MockedResponse[] = [
	CreateStockPortfolioMock,
	CreateStripeSetupIntentMock,
	DeleteStockPortfolioMock,
	GetDataKeyOptionsMock,
	GetFeaturePricingMock,
	GetManyStockPortfoliosMock,
	...GetOneStockPortfolioMocks,
	GetPriceBundlesMock,
	GetStockPortfolioEventMock,
	GetUserMock,
	SearchStockSymbolsMock
];
