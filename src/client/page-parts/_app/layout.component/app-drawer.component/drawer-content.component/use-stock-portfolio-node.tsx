import { Anchor, Tooltip } from "@/client/components";
import {
	GetStockPortfoliosForPreview,
	GetStockPortfoliosForPreviewVariables,
	Queries
} from "@/client/graphql";
import { useSetUser } from "@/client/hooks";
import { ITreeNode } from "@blueprintjs/core";
import { NextRouter, useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "react-apollo";

interface IProps {
	id: number;
}

export const useStockPortfoliosNode = (
	{ id }: IProps,
	[contents, setContents]: [ITreeNode[], (node: ITreeNode[]) => void]
) => {
	const router: NextRouter = useRouter();
	const [, { user }] = useSetUser();

	const { data } = useQuery<GetStockPortfoliosForPreview, GetStockPortfoliosForPreviewVariables>(
		Queries.GetStockPortfoliosForPreview,
		{
			variables: {
				first: 10,
				skip: 0,
				where: { user: { id: { equals: user?.id } } }
			}
		}
	);

	const onShowMore = useCallback(() => {
		if (!user) {
			return;
		}

		router.push(`/users/${user.id}/stock-portfolios`);
	}, [router, user]);

	const withUserProps: Omit<ITreeNode, "id" | "label"> = useMemo(
		() => ({
			hasCaret: true,
			icon: "folder-close",
			childNodes: [
				...(data?.stockPortfolios || []).map((portfolio) => ({
					id: portfolio.id,
					label: (
						<Tooltip content={`Updated at: ${portfolio.updatedAt}`} position="right">
							{portfolio.name}
						</Tooltip>
					)
				})),
				{
					id: "show-more",
					label: (
						<Tooltip content="Create and update my stock portfolios" position="right">
							<Anchor value="Show more" />
						</Tooltip>
					),
					onClick: onShowMore
				}
			]
		}),
		[data, onShowMore]
	);

	const withoutUserProps: Omit<ITreeNode, "id" | "label"> = useMemo(
		() => ({
			hasCaret: false,
			onClick: () => {
				router.replace("/login");
			}
		}),
		[router]
	);

	const node: ITreeNode = useMemo(() => {
		return {
			id,
			label: "Stock portfolios",
			...(user ? withUserProps : withoutUserProps)
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
