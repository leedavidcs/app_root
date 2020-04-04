interface IPriceBundle {
	credits: number;
	price: number;
}

export const PriceBundles: Record<number, IPriceBundle> = {
	0: {
		credits: 500,
		price: 4.99
	},
	1: {
		credits: 2200,
		price: 19.99
	},
	2: {
		credits: 6000,
		price: 49.99
	},
	3: {
		credits: 13000,
		price: 99.99
	}
};
