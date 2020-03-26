import {
	UpdateOneStockPortfolioMutationVariables,
	useUpdateOneStockPortfolioMutation
} from "@/client/graphql";
import { useToast } from "@/client/hooks";
import { useCallback } from "react";
import { IFormData } from ".";

export const useFormSubmitHandler = (
	values: Pick<UpdateOneStockPortfolioMutationVariables, "headers" | "id" | "tickers">
) => {
	const [updatePortfolio] = useUpdateOneStockPortfolioMutation();

	const toast = useToast();

	const onFormSubmit = useCallback(
		async (data: IFormData) => {
			const variables: UpdateOneStockPortfolioMutationVariables = { ...data, ...values };

			try {
				await updatePortfolio({ variables });
			} catch (err) {
				if (err instanceof Error) {
					toast.show({
						message: err.message,
						intent: "danger"
					});
				}

				return;
			}

			toast.show({
				message: "Successfully updated",
				intent: "success"
			});
		},
		[toast, updatePortfolio, values]
	);

	return onFormSubmit;
};
