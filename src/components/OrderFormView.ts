import { PaymentMethod } from '../types';
import { IEvents } from './base/Events';
import { Form } from './base/Form';
import { ensureAllElements } from '../utils/utils';

interface IOrderFormView {
	paymentMethod: PaymentMethod;
	address: string;
}

export class OrderFormView extends Form<IOrderFormView> {
	private paymentMethodButtons: HTMLButtonElement[];
	private addressElement: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.paymentMethodButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
		this.paymentMethodButtons.forEach(button => {
			button.addEventListener('click', this.handlePaymentMethodClick.bind(this));
		});
		this.addressElement = container.elements.namedItem('address') as HTMLInputElement;
	}

	private handlePaymentMethodClick(evt: Event): void {
		const selectedPaymentButton = evt.target as HTMLButtonElement;
		this.paymentMethod = selectedPaymentButton.name;
		this.events.emit('order:paymentMethodChange', selectedPaymentButton);
	}

	set paymentMethod(value: string) {
		this.paymentMethodButtons.forEach(button => {
			this.toggleClass(button, 'button_alt-active', button.name === value);
		});
	}

	set address(value: string) {
		this.addressElement.value = value;
	}
}