import { Form } from './base/Form';
import { IEvents } from './base/Events';

interface IContactFormView {
	email: string;
	phone: string;
}

export class ContactFormView extends Form<IContactFormView> {
	private emailElement: HTMLInputElement;
	private phoneElement: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.emailElement = container.elements.namedItem('email') as HTMLInputElement;
		this.phoneElement = container.elements.namedItem('phone') as HTMLInputElement;
	}

	set email(value: string) {
		this.emailElement.value = value;
	}

	set phone(value: string) {
		this.phoneElement.value = value;
	}
}