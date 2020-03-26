import {
	UpdateOneStockPortfolioMutationVariables,
	useUpdateOneStockPortfolioMutation
} from "@/client/graphql";
import { useCallback, useMemo, useState } from "react";
import { IFormData } from ".";

export const useFormSubmitHandler = (
	values: Pick<UpdateOneStockPortfolioMutationVariables, "headers" | "id" | "tickers">
) => {
	const [updatePortfolio] = useUpdateOneStockPortfolioMutation();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onFormSubmit = useCallback(
		(data: IFormData) => {
			const variables: UpdateOneStockPortfolioMutationVariables = { ...data, ...values };

			updatePortfolio({ variables }).catch((err) => {
				if (err instanceof Error) {
					setErrorMessage(err.message);
				}
			});
		},
		[updatePortfolio, values]
	);

	return useMemo(() => ({ errorMessage, onFormSubmit }), [errorMessage, onFormSubmit]);
};
