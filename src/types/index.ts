export type PaymentMethod = 'online' | 'cash';

export type price = number | null;

export interface IProduct {
	id: string;
	category: string;
	title: string;
	description: string;
	image: string;
	price: price;
}

export interface IOrder {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethod;
	items: string[];
	total: number;
}

export type OrderValidationErrors = Partial<Record<keyof IOrder, string>>;
