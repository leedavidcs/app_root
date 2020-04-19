import { Alert } from "@/client/components/alert.component";
import {
	DeleteStockPortfolioMutation,
	GetOneStockPortfolioQuery,
	useDeleteStockPortfolioMutation
} from "@/client/graphql";
import { AnchorButton, Button, ButtonGroup } from "@blueprintjs/core";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";

interface IProps {
	className?: string;
	stockPortfolio: GetOneStockPortfolioQuery["stockPortfolio"];
}

const useOnDelete = ({ stockPortfolio }: IProps) => {
	const router: NextRouter = useRouter();

	const onCompleted = useCallback(
		(data: DeleteStockPortfolioMutation) => {
			if (!data.deleteOneStockPortfolio || !stockPortfolio) {
				return;
			}

			const { user } = stockPortfolio;

			router.push(`/users/${user.id}/stock-portfolios`);
		},
		[router, stockPortfolio]
	);

	const [deletePortfolio] = useDeleteStockPortfolioMutation({ onCompleted });

	return useCallback(() => {
		if (!stockPortfolio) {
			return;
		}

		const { id } = stockPortfolio;

		deletePortfolio({ variables: { id } });
	}, [deletePortfolio, stockPortfolio]);
};

export const CreatorActions: FC<IProps> = (props) => {
	const { className, stockPortfolio } = props;

	const [alertOpen, setAlertOpen] = useState<boolean>(false);

	const onBtnDelete = useCallback(() => setAlertOpen(true), [setAlertOpen]);
	const onAlertClose = useCallback(() => setAlertOpen(false), [setAlertOpen]);

	const onDelete = useOnDelete(props);

	if (!stockPortfolio) {
		return null;
	}

	const { id, name } = stockPortfolio;

	return (
		<>
			<ButtonGroup className={className}>
				<Link href={`/stock-portfolios/${id}/edit`} passHref={true}>
					<AnchorButton icon="edit" text="Edit" />
				</Link>
				<Button icon="trash" onClick={onBtnDelete} text="Delete" />
			</ButtonGroup>
			<Alert
				cancelButtonText="Cancel"
				confirmButtonText="Delete"
				icon="trash"
				intent="danger"
				isOpen={alertOpen}
				onClose={onAlertClose}
				onConfirm={onDelete}
			>
				<>
					<p>
						You are about to delete Portfolio, &quot;{name}&quot;. This action cannot be
						undone.
					</p>
					<p>Do you wish to continue?</p>
				</>
			</Alert>
		</>
	);
};
