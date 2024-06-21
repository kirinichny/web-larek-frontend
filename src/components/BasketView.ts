import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IBasketView {
	productList: HTMLElement;
	totalCost: string;
}

export class BasketView extends Component<IBasketView> {
	private productListElement: HTMLElement;
	private readonly totalCostElement: HTMLElement;
	private readonly checkoutButtonElement: HTMLButtonElement;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		this.productListElement = ensureElement('.basket__list', container);
		this.totalCostElement = ensureElement('.basket__price', container);
		this.checkoutButtonElement = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.checkoutButtonElement.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set productList(productList: HTMLElement[]) {
		this.productListElement.replaceChildren(...productList);
	}

	set totalCost(totalCost: string) {
		this.setText(this.totalCostElement, totalCost);
	}

	toggleCheckoutButton(isDisabled: boolean): void {
		this.setDisabled(this.checkoutButtonElement, isDisabled);
	}
}