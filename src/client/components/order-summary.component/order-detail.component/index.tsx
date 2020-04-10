import { OrderDetailInput } from "@/client/graphql";
import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

export interface IOrderDetail extends OrderDetailInput {
	name: string;
	price: number;
	quantity: number;
}

interface IProps extends IOrderDetail {
	className?: string;
}

export const OrderDetail: FC<IProps> = ({ className, name, price, quantity }) => {
	const classes = useStyles();

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.itemDetails}>
				<span className={classes.itemName}>{name}</span>
				<span>${price}</span>
			</div>
			<div>Qty: {quantity}</div>
		</div>
	);
};
