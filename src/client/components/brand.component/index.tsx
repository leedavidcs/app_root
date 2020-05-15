import { AnchorButton } from "@/client/components/anchor-button.component";
import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

const brand: string = process.env.BRAND_NAME || "TheBrand Inc.";

interface IProps {
	className?: string;
}

export const Brand: FC<IProps> = ({ className }) => {
	const classes = useStyles();

	return (
		<AnchorButton
			href="/"
			className={classnames(classes.root, className)}
			minimal={true}
			text={brand}
		/>
	);
};
