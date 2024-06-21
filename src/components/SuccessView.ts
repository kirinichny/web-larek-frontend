import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ISuccess {
	description: string;
}

interface ISuccessActions {
	onClick: (evt: MouseEvent) => void;
}

export class SuccessView extends Component<ISuccess> {
	private readonly descriptionElement: HTMLElement;
	private closeButtonElement: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this.descriptionElement = ensureElement('.order-success__description', container);
		this.closeButtonElement = ensureElement('.order-success__close', container);

		if (actions.onClick) {
			this.closeButtonElement.addEventListener('click', actions.onClick);
		}
	}

	set description(value: string) {
		this.setText(this.descriptionElement, value);
	}
}