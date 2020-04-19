import { IHeaderOption } from "@/client/components";
import { Alert } from "@/client/components/alert.component";
import {
	DeleteStockPortfolioMutation,
	GetOneStockPortfolioQuery,
	useDeleteStockPortfolioMutation,
	useGetUserQuery
} from "@/client/graphql";
import { AnchorButton, Button, ButtonGroup, Classes } from "@blueprintjs/core";
import classnames from "classnames";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { AddColumnSelect } from "./add-column-select.component";
import { AddTickerInput } from "./add-ticker-input.component";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
	columnOptions: readonly IHeaderOption[];
	onAddTicker: (ticker: string) => void;
	onAddColumn: (option: IHeaderOption) => void;
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
	const { className, columnOptions, onAddTicker, onAddColumn, stockPortfolio } = props;

	const classes = useStyles();

	const [alertOpen, setAlertOpen] = useState<boolean>(false);

	const getUserResult = useGetUserQuery();
	const user = getUserResult.data?.user ?? null;

	const onBtnDelete = useCallback(() => setAlertOpen(true), [setAlertOpen]);
	const onAlertClose = useCallback(() => setAlertOpen(false), [setAlertOpen]);

	const onDelete = useOnDelete(props);

	const { id, name } = stockPortfolio;

	return (
		<>
			<div className={classes.root}>
				<div className={classes.addInputContainers}>
					<AddTickerInput className={classes.addTicker} onAddTicker={onAddTicker} />
					<AddColumnSelect
						className={classes.addColumn}
						columnOptions={columnOptions}
						onSelect={onAddColumn}
					/>
				</div>
				<ButtonGroup className={classnames(Classes.DARK, className)}>
					<Link
						href={user ? `/users/${user.id}/stock-portfolios/${id}` : "/sign-up"}
						passHref={true}
					>
						<AnchorButton text="View" />
					</Link>
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
