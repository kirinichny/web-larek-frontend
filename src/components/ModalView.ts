import { IEvents } from './base/Events';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface IModalView {
	content: HTMLElement;
}

export class ModalView extends Component<IModalView> {
	private contentElement: HTMLElement;
	private closeButtonElement: HTMLElement;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		this.contentElement = ensureElement('.modal__content', container);
		this.closeButtonElement = ensureElement('.modal__close', container);

		this.container.addEventListener('click', () => this.close());
		this.contentElement.addEventListener('click', (event) => event.stopPropagation());
		this.closeButtonElement.addEventListener('click', () => this.close());
	}

	set content(content: HTMLElement) {
		this.contentElement.replaceChildren(content);
	}

	open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.content = null;
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	render(data: IModalView): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}