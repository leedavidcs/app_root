import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

export interface IOrderDetailProps {
	className?: string;
	item: string;
	price: number;
	quantity: number;
}

export const OrderDetail: FC<IOrderDetailProps> = ({ className, item, price, quantity }) => {
	const classes = useStyles();

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.itemDetails}>
				<span className={classes.itemName}>{item}</span>
				<span>${price}</span>
			</div>
			<div>Qty: {quantity}</div>
		</div>
	);
};
