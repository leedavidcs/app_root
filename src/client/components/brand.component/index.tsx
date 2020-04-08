import { AnchorButton } from "@blueprintjs/core";
import classnames from "classnames";
import Link from "next/link";
import React, { FC } from "react";
import { useStyles } from "./styles";

const brand: string = process.env.BRAND_NAME || "TheBrand Inc.";

interface IProps {
	className?: string;
}

export const Brand: FC<IProps> = ({ className }) => {
	const classes = useStyles();

	return (
		<Link href="/" passHref={true}>
			<AnchorButton
				className={classnames(classes.root, className)}
				minimal={true}
				text={brand}
			/>
		</Link>
	);
};
