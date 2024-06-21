import { IProduct, price } from '../types';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { UI_TEXT } from '../utils/constants';

interface IProductActions {
	onClick: (evt: MouseEvent) => void;
}

interface IProductBasketView {
	index: number;
	title: string;
	price: number;
}

const categoryClassMap: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	'кнопка': 'card__category_button',
	'дополнительное': 'card__category_additional',
	'другое': 'card__category_other',
};

export class ProductView extends Component<IProduct> {
	private readonly categoryElement: HTMLElement;
	private readonly titleElement: HTMLElement;
	private readonly imageElement: HTMLImageElement;
	private readonly priceElement: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container);

		this.categoryElement = ensureElement('.card__category', container);
		this.titleElement = ensureElement('.card__title', container);
		this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
		this.priceElement = ensureElement('.card__price', container);

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	getCategoryClass(categoryName: string): string {
		return categoryClassMap[categoryName] || categoryClassMap['другое'];
	}

	set category(categoryName: string) {
		this.setText(this.categoryElement, categoryName);
		this.categoryElement.classList.add(this.getCategoryClass(categoryName));
	}

	set title(title: string) {
		this.setText(this.titleElement, title);
	}

	set image(imageSrc: string) {
		this.setImage(this.imageElement, imageSrc, this.getText(this.imageElement));
	}

	set price(price: price) {
		const formattedPrice = price === null ? UI_TEXT.PRICELESS : price.toString() + ' ' + UI_TEXT.SYNAPSE_UNIT;
		this.setText(this.priceElement, formattedPrice);
	}

	getFormattedPrice(): string {
		return this.getText(this.priceElement);
	}
}

export class ProductDetailView extends ProductView {
	private readonly descriptionElement: HTMLElement;
	private readonly addToBasketButtonElement: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container);

		this.descriptionElement = ensureElement('.card__text', container);
		this.addToBasketButtonElement = ensureElement('.card__button', container);

		if (actions?.onClick) {
			this.addToBasketButtonElement.addEventListener('click', (evt: MouseEvent) => {
				actions.onClick(evt);
			});
		}
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}

	setAddToBasketButtonState(isInBasket: boolean): void {
		const button = this.addToBasketButtonElement;
		const buttonText = isInBasket
			? UI_TEXT.DELETE_FROM_BASKET : UI_TEXT.ADD_TO_BASKET;

		const isPriceMissing = this.getFormattedPrice() === UI_TEXT.PRICELESS;

		this.setDisabled(button, isPriceMissing);
		this.setText(button, buttonText);
	}
}

export class ProductBasketView extends Component<IProductBasketView> {
	private readonly itemIndexElement: HTMLElement;
	private readonly titleElement: HTMLElement;
	private readonly priceElement: HTMLElement;
	private readonly deleteFromBasketButtonElement: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container);

		this.itemIndexElement = ensureElement('.basket__item-index', container);
		this.titleElement = ensureElement('.card__title', container);
		this.priceElement = ensureElement('.card__price', container);
		this.deleteFromBasketButtonElement = ensureElement('.card__button', container);

		if (actions?.onClick) {
			this.deleteFromBasketButtonElement.addEventListener('click', (evt: MouseEvent) => {
				actions.onClick(evt);
			});
		}
	}

	set index(value: string) {
		this.setText(this.itemIndexElement, value);
	}

	set title(title: string) {
		this.setText(this.titleElement, title);
	}

	set price(price: price) {
		const formattedPrice = price === null ? UI_TEXT.PRICELESS : price.toString() + ' ' + UI_TEXT.SYNAPSE_UNIT;
		this.setText(this.priceElement, formattedPrice);
	}
}



