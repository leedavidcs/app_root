import { ITreeNode, Tree } from "@blueprintjs/core";
import React, { FC, useCallback, useState } from "react";
import { useStockPortfoliosNode } from "./use-stock-portfolio-node";

const useContents = (): [ITreeNode[], (nodes: ITreeNode[]) => void] => {
	const state = useState<ITreeNode[]>([]);

	useStockPortfoliosNode({ id: 0 }, state);

	return state;
};

const forEachNode = (nodes: ITreeNode[] | undefined, callback: (node: ITreeNode) => void): void => {
	if (!nodes) {
		return;
	}

	nodes.forEach((node) => {
		callback(node);

		forEachNode(node.childNodes, callback);
	});
};

export const DrawerContent: FC = () => {
	const [contents, setContents] = useContents();

	const onNodeClick = useCallback(
		(data: ITreeNode) => {
			forEachNode(contents, (node) => (node.isSelected = false));

			data.isSelected = !data.isSelected;
			data.isExpanded = !data.isExpanded;
			(data as any).onClick?.();

			setContents(contents.slice());
		},
		[contents, setContents]
	);

	const onNodeCollapse = useCallback(
		(data: ITreeNode) => {
			data.isExpanded = false;

			setContents(contents.slice());
		},
		[contents, setContents]
	);

	const onNodeExpand = useCallback(
		(data: ITreeNode) => {
			data.isExpanded = true;

			setContents(contents.slice());
		},
		[contents, setContents]
	);

	return (
		<Tree
			contents={contents}
			onNodeClick={onNodeClick}
			onNodeCollapse={onNodeCollapse}
			onNodeExpand={onNodeExpand}
		/>
	);
};
