import { Anchor, Tooltip } from "@/client/components";
import { useGetManyStockPortfoliosQuery } from "@/client/graphql";
import { ISetUserStates, useSetUser } from "@/client/hooks";
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
	const [, { user }] = useSetUser();

	const { data } = useGetManyStockPortfoliosQuery({
		variables: {
			first: 10,
			skip: 0,
			where: { user: { id: { equals: user?.id } } }
		}
	});

	const onClickPortfolio = useCallback(
		(userId: string, portfolioId: string) => () => {
			router.push(`/users/${userId}/stock-portfolios/${portfolioId}`);
		},
		[router]
	);

	const onShowMore = useCallback(
		(userId: string) => () => router.push(`/users/${userId}/stock-portfolios`),
		[router]
	);

	const withUserProps = useCallback(
		memoizeOne(
			(
				_user: NonNullable<ISetUserStates["user"]>
			): Omit<ICustomTreeNode, "id" | "label"> => ({
				className: classes.btnItem,
				hasCaret: true,
				icon: "folder-close",
				childNodes: [
					...(data?.stockPortfolios || []).map((portfolio) => ({
						className: classes.btnItem,
						id: portfolio.id,
						label: (
							<Tooltip
								content={`Updated at: ${portfolio.updatedAt}`}
								position="right"
							>
								{portfolio.name}
							</Tooltip>
						),
						onClick: onClickPortfolio(_user?.id, portfolio.id)
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
						onClick: onShowMore(_user.id)
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
