import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { ensureElement } from '../utils/utils';

export interface IPageView {
	productListElement: HTMLElement;
	basketProductCount: number;
	isLocked: boolean;
}

export class PageView extends Component<IPageView> {
	private readonly pageWrapperElement: HTMLElement;
	private productListElement: HTMLElement;
	private basketElement: HTMLElement;
	private readonly basketCounterElement: HTMLElement;
	private readonly lockedPageClass: string;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		this.pageWrapperElement = ensureElement('.page__wrapper');
		this.productListElement = ensureElement('.gallery');
		this.basketElement = ensureElement('.header__basket');
		this.basketCounterElement = ensureElement('.header__basket-counter');
		this.lockedPageClass = 'page__wrapper_locked';

		this.basketElement.addEventListener('click', () => {
			this.events.emit('basket:click');
		});
	}

	setProductList(productList: HTMLElement[]): void {
		this.productListElement.replaceChildren(...productList);
	}

	setBasketCounter(value: number): void {
		this.setText(this.basketCounterElement, value);
	}

	toggleLockPage(isLocked: boolean): void {
		this.toggleClass(this.pageWrapperElement, this.lockedPageClass, isLocked);
	}
}