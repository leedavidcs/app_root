import classnames from "classnames";
import React, { FC } from "react";
import { useStyles } from "./styles";

interface IOrderItem {
	value: any;
	name: string;
}

export interface IOrderDetail {
	item: IOrderItem;
	price: number;
	quantity: number;
}

interface IProps extends IOrderDetail {
	className?: string;
}

export const OrderDetail: FC<IProps> = ({ className, item, price, quantity }) => {
	const classes = useStyles();

	return (
		<div className={classnames(classes.root, className)}>
			<div className={classes.itemDetails}>
				<span className={classes.itemName}>{item.name}</span>
				<span>${price}</span>
			</div>
			<div>Qty: {quantity}</div>
		</div>
	);
};
