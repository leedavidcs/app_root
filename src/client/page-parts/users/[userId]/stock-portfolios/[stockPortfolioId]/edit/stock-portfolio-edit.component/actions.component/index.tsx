import { Alert } from "@/client/components/alert.component";
import {
	DeleteStockPortfolioMutation,
	GetOneStockPortfolioQuery,
	useDeleteStockPortfolioMutation
} from "@/client/graphql";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { AddTickerInput } from "./add-ticker-input.component";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	onAddTicker: (ticker: string) => void;
	stockPortfolio: NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;
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

export const Actions: FC<IProps> = (props) => {
	const { className, onAddTicker, stockPortfolio } = props;

	const classes = useStyles();

	const [alertOpen, setAlertOpen] = useState<boolean>(false);

	const onBtnDelete = useCallback(() => setAlertOpen(true), [setAlertOpen]);
	const onAlertClose = useCallback(() => setAlertOpen(false), [setAlertOpen]);

	const onDelete = useOnDelete(props);

	const { name } = stockPortfolio;

	return (
		<>
			<div className={classes.root}>
				<AddTickerInput className={classes.addTickerInput} onAddTicker={onAddTicker} />
				<ButtonGroup className={classnames(Classes.DARK, className)}>
					<Button icon="saved" text="Save" type="submit" />
					<Button icon="trash" onClick={onBtnDelete} text="Delete" />
				</ButtonGroup>
			</div>
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
