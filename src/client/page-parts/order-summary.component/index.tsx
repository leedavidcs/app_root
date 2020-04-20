import { Paper } from "@/client/components";
import { OrderDetailType } from "@/client/graphql";
import classnames from "classnames";
import React, { FC, ReactElement, useMemo } from "react";
import { IOrderDetail, OrderDetail } from "./order-detail.component";
import { useStyles } from "./styles";

export * from "./order-detail.component";

interface IProps {
	orderDetails?: readonly IOrderDetail[];
	children?: ReactElement;
	className?: string;
}

export const OrderSummary: FC<IProps> = ({ orderDetails = [], children, className }) => {
	const classes = useStyles();

	const orderSummary = useMemo(
		() =>
			orderDetails.reduce(
				(acc, { price, quantity }) => ({
					items: acc.items + quantity,
					price: acc.price + price
				}),
				{ items: 0, price: 0 } as { items: number; price: number }
			),
		[orderDetails]
	);

	return (
		<Paper className={classnames(classes.root, className)}>
			<h3>Order Summary</h3>
			<div className={classes.content}>
				{orderDetails.map(({ id, name, quantity, price }) => (
					<OrderDetail
						key={id}
						id={id}
						name={name}
						quantity={quantity}
						price={price}
						type={OrderDetailType.PriceBundle}
					/>
				))}
			</div>
			<div className={classes.summary}>
				<div className={classes.totalPriceContainer}>
					Order total:
					<div className={classes.totalPrice}>${orderSummary.price}</div>
				</div>
				{children}
			</div>
		</Paper>
	);
};
