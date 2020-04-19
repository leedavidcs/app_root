import { Anchor, Tooltip } from "@/client/components";
import { GetUserQuery, useGetManyStockPortfoliosQuery, useGetUserQuery } from "@/client/graphql";
import { format } from "date-fns";
import memoizeOne from "memoize-one";
import { NextRouter, useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo } from "react";
import { ICustomTreeNode } from ".";
import { useStyles } from "./styles";

interface IProps {
	id: number;
}

export const useStockPortfoliosNode = (
	{ id }: IProps,
	[contents, setContents]: [ICustomTreeNode[], (node: ICustomTreeNode[]) => void]
) => {
	const classes = useStyles();

	const router: NextRouter = useRouter();
	const getUserResult = useGetUserQuery();

	const user = getUserResult.data?.user ?? null;

	const { data } = useGetManyStockPortfoliosQuery({
		variables: {
			first: 10,
			skip: 0,
			where: { user: { id: { equals: user?.id } } }
		}
	});

	const onClickPortfolio = useCallback(
		(portfolioId: string) => () => {
			router.push(`/stock-portfolios/${portfolioId}`);
		},
		[router]
	);

	const onShowMore = useCallback(
		(userId: string) => () => router.push(`/users/${userId}/stock-portfolios`),
		[router]
	);

	const withUserProps = useCallback(
		memoizeOne(
			(_user: GetUserQuery["user"]): Omit<ICustomTreeNode, "id" | "label"> => ({
				className: classes.btnItem,
				hasCaret: true,
				icon: "folder-close",
				childNodes: [
					...(data?.stockPortfolios || []).map((portfolio) => ({
						className: classes.btnItem,
						id: portfolio.id,
						label: (
							<Tooltip
								content={`Updated at: ${format(
									new Date(portfolio.updatedAt),
									"PPPppp"
								)}`}
								position="right"
							>
								{portfolio.name}
							</Tooltip>
						),
						onClick: onClickPortfolio(portfolio.id)
					})),
					{
						className: classes.btnItem,
						id: "show-more",
						label: (
							<Tooltip
								content="Create and update my stock portfolios"
								position="right"
							>
								<Anchor value="Show more" />
							</Tooltip>
						),
						onClick: onShowMore(_user!.id)
					}
				]
			})
		),
		[data, onShowMore, user]
	);

	const withoutUserProps: Omit<ICustomTreeNode, "id" | "label"> = useMemo(
		() => ({
			hasCaret: false,
			onClick: () => {
				router.replace("/login");
			}
		}),
		[router]
	);

	const node: ICustomTreeNode = useMemo(() => {
		return {
			id,
			label: "Stock portfolios",
			...(user ? withUserProps(user) : withoutUserProps)
		};
	}, [id, user, withUserProps, withoutUserProps]);

	useEffect(
		() => {
			contents[id] = node;

			setContents(contents.slice());
		},
		/* eslint-disable react-hooks/exhaustive-deps */
		[id, node, setContents]
	);

	return node;
};
