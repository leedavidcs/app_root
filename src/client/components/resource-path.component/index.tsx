import { Icon, IconName } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, memo, ReactNodeArray } from "react";
import { IResourcePathPart, ResourcePathPart } from "./resource-path-part.component";
import { useStyles } from "./styles";

interface IProps {
	children: ReactNodeArray;
	className?: string;
	icon?: IconName;
}

interface IWithStaticProps {
	Part: FC<IResourcePathPart>;
}

const _ResourcePath: FC<IProps> = memo(({ children, className, icon }) => {
	const classes = useStyles();

	return (
		<h1 className={classnames(classes.root, className)}>
			{icon && <Icon className={classes.icon} icon={icon} />}
			{children}
		</h1>
	);
});

_ResourcePath.displayName = "ResourcePath";

(_ResourcePath as FC<IProps> & IWithStaticProps).Part = ResourcePathPart;

export const ResourcePath = _ResourcePath as FC<IProps> & IWithStaticProps;
