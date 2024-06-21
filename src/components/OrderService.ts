import { Model } from './base/Model';
import { IOrder, IProduct, OrderValidationErrors, PaymentMethod } from '../types';
import { UI_TEXT } from '../utils/constants';

interface IOrderService {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethod;
	items: IProduct[];
	totalCost: number;
	validationErrors: OrderValidationErrors;
}

export class OrderService extends Model<IOrderService> {
	private email = '';
	private phone = '';
	private address = '';
	private payment: PaymentMethod;
	private items: IProduct[] = [];
	private totalCost = 0;
	private validationErrors: OrderValidationErrors = {};

	setPaymentMethod(value: string): void {
		this.payment = value as PaymentMethod;
		this.validateField('payment');
	}

	setField(fieldName: keyof Omit<IOrder, 'payment' | 'items' | 'total'>, value: string): void {
		this[fieldName] = value;
		this.validateField(fieldName);
	}

	addItem(item: IProduct): void {
		this.items.push(item);
		this.updateTotalCost();
		this.emitChanges('order:itemsChanged', this.items);
	}

	deleteItem(item: IProduct): void {
		this.items = this.items.filter(i => i.id !== item.id);
		this.updateTotalCost();
		this.emitChanges('order:itemsChanged', this.items);
	}

	updateTotalCost(): void {
		this.totalCost = this.items.reduce((acc: number, item: IProduct) => acc + item.price, 0);
	}

	getEmail(): string {
		return this.email;
	}

	getPhone(): string {
		return this.phone;
	}

	getAddress(): string {
		return this.address;
	}

	getPaymentMethod(): PaymentMethod {
		return this.payment;
	}

	getItems(): IProduct[] {
		return this.items;
	}

	getTotalCost(): number {
		return this.totalCost;
	}

	getFormattedTotalCost(): string {
		return this.getTotalCost().toString() + ' ' + UI_TEXT.SYNAPSE_UNIT;
	}

	getItemCount(): number {
		return this.getItems().length;
	}

	isOrderEmpty(): boolean {
		return this.getItemCount() === 0;
	}

	isItemInOrder(item: IProduct): boolean {
		return this.items.some(i => i.id === item.id);
	}

	validateField(field: keyof IOrder): void {
		const errors: OrderValidationErrors = {};

		if (field === 'payment' || field === 'address') {
			if (!this.address || this.address.trim().length === 0) {
				errors.address = 'Некорректный адрес';
			} else if (!this.payment) {
				errors.payment = 'Не выбран метод оплаты';
			}
		} else if (field === 'phone' || field === 'email') {
			if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
				errors.email = 'Некорректный email';
			} else if (!this.phone || !/^\+?[0-9]{7,15}$/.test(this.phone)) {
				errors.phone = 'Некорректный номер телефона';
			}
		}

		this.validationErrors = errors;
		this.emitChanges('order:validationErrorsChanged', this.validationErrors);
	}

	clearOrder(): void {
		this.email = '';
		this.phone = '';
		this.address = '';
		this.payment = null;
		this.items = [];
		this.totalCost = 0;
		this.validationErrors = {};
		this.emitChanges('order:itemsChanged', this.items);
	}
}