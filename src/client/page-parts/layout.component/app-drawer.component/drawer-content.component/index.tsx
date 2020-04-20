import { ITreeNode, Tree } from "@blueprintjs/core";

import React, { FC, useCallback, useState } from "react";
import { useStockPortfoliosNode } from "./use-stock-portfolio-node";

export interface ICustomTreeNode extends Omit<ITreeNode, "childNodes"> {
	childNodes?: ICustomTreeNode[];
	onClick?: () => void;
}

const useContents = (): [ICustomTreeNode[], (nodes: ICustomTreeNode[]) => void] => {
	const state = useState<ICustomTreeNode[]>([]);

	useStockPortfoliosNode({ id: 0 }, state);

	return state;
};

const forEachNode = (
	nodes: ICustomTreeNode[] | undefined,
	callback: (node: ICustomTreeNode) => void
): void => {
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
		(data: ICustomTreeNode) => {
			forEachNode(contents, (node) => (node.isSelected = false));

			data.isSelected = !data.isSelected;
			data.isExpanded = !data.isExpanded;
			data.onClick?.();

			setContents(contents.slice());
		},
		[contents, setContents]
	);

	const onNodeCollapse = useCallback(
		(data: ICustomTreeNode) => {
			data.isExpanded = false;

			setContents(contents.slice());
		},
		[contents, setContents]
	);

	const onNodeExpand = useCallback(
		(data: ICustomTreeNode) => {
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
