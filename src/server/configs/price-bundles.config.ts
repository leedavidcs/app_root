interface IPriceBundle {
	credits: number;
	price: number;
}

export const PriceBundles: Record<number, IPriceBundle> = {
	1: {
		credits: 500,
		price: 4.99
	},
	2: {
		credits: 2200,
		price: 19.99
	},
	3: {
		credits: 6000,
		price: 49.99
	},
	4: {
		credits: 11500,
		price: 99.99
	}
};
