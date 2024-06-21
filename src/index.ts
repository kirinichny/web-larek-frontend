import './scss/styles.scss';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL, CDN_URL, UI_TEXT } from './utils/constants';
import { ProductService } from './components/ProductService';
import { EventEmitter, IEvents } from './components/base/Events';
import { PageView } from './components/PageView';
import { ProductBasketView, ProductDetailView, ProductView } from './components/ProductView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { OrderService } from './components/OrderService';
import { IOrder, IProduct, OrderValidationErrors } from './types';
import { ModalView } from './components/ModalView';
import { BasketView } from './components/BasketView';
import { OrderFormView } from './components/OrderFormView';
import { ContactFormView } from './components/ContactFormView';
import { SuccessView } from './components/SuccessView';

const productListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement('#modal-container');

const api: WebLarekApi = new WebLarekApi(API_URL, CDN_URL);
const events: IEvents = new EventEmitter();

const productService: ProductService = new ProductService({}, events);
const orderService: OrderService = new OrderService({}, events);

const pageView: PageView = new PageView(document.body, events);
const modalView: ModalView = new ModalView(modalContainer, events);
const basketView: BasketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderFormView: OrderFormView = new OrderFormView(cloneTemplate(orderFormTemplate), events);
const contactFormView: ContactFormView = new ContactFormView(cloneTemplate(contactFormTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), { onClick: () => modalView.close() });

events.on('products:changed', handleProductsChanged);
events.on('product:selected', handleProductSelected);
events.on('basket:click', handleBasketClick);
events.on('order:itemAdd', handleOrderItemAdd);
events.on('order:itemDelete', handleOrderItemDelete);
events.on('order:itemsChanged', handleOrderItemsChanged);
events.on('order:open', handleOrderFormOpen);
events.on('order:paymentMethodChange', handleOrderFormPaymentMethodChanged);
events.on(/^(order|contacts)\.\w*:change/, handleOrderFormFieldChanged);
events.on('order:validationErrorsChanged', handleOrderValidationErrorsChanged);
events.on('order:submit', handleOrderFormSubmit);
events.on('contacts:submit', handleContactFormSubmit);
events.on('modal:open', handleModalOpen);
events.on('modal:close', handleModalClose);

function renderBasket() {
	let itemIndex = 1;

	basketView.productList = orderService.getItems().map((itemData: IProduct) => {
		const item = new ProductBasketView(cloneTemplate(basketItemTemplate), {
			onClick: () => events.emit('order:itemDelete', itemData),
		});

		return item.render({
			title: itemData.title,
			price: itemData.price,
			index: itemIndex++,
		});
	});

	basketView.totalCost = orderService.getFormattedTotalCost();
	basketView.toggleCheckoutButton(orderService.isOrderEmpty());
	modalView.render({ content: basketView.render() });
}

function handleProductsChanged(): void {
	pageView.setProductList(productService.getProducts().map(productData => {
		const product = new ProductView(cloneTemplate(productListTemplate), {
			onClick: () => productService.setSelectedProduct(productData),
		});

		return product.render({
			id: productData.id,
			title: productData.title,
			image: productData.image,
			category: productData.category,
			price: productData.price,
		});
	}));
}

function handleProductSelected(productData: IProduct): void {
	const isProductInOrder = orderService.isItemInOrder(productData);
	const product = new ProductDetailView(cloneTemplate(productPreviewTemplate), {
		onClick: () => events.emit('order:itemAdd', productData),
	});

	const renderedProduct: HTMLElement = product.render({
		id: productData.id,
		title: productData.title,
		description: productData.description,
		image: productData.image,
		category: productData.category,
		price: productData.price,
	});

	product.setAddToBasketButtonState(isProductInOrder);
	modalView.render({ content: renderedProduct });
}

function handleBasketClick(): void {
	renderBasket();
}

function handleOrderItemAdd(itemData: IProduct): void {
	const isProductInOrder = orderService.isItemInOrder(itemData);

	if (isProductInOrder) {
		orderService.deleteItem(itemData);
	} else {
		orderService.addItem(itemData);
	}

	modalView.close();
}

function handleOrderItemDelete(itemData: IProduct): void {
	orderService.deleteItem(itemData);
	renderBasket();
}

function handleOrderItemsChanged(): void {
	pageView.setBasketCounter(orderService.getItemCount());
}

function handleOrderFormOpen(): void {
	const renderedOrderForm: HTMLElement = orderFormView.render({
		paymentMethod: orderService.getPaymentMethod(),
		address: orderService.getAddress(),
		valid: false,
		errors: [],
	});

	modalView.render({ content: renderedOrderForm });
}

function handleOrderFormPaymentMethodChanged(paymentMethodButton: HTMLButtonElement): void {
	orderService.setPaymentMethod(paymentMethodButton.name);
}

function handleOrderFormFieldChanged(data: {
	field: keyof Omit<IOrder, 'payment' | 'items' | 'total'>;
	value: string
}) {
	orderService.setField(data.field, data.value);
}

function handleOrderValidationErrorsChanged(errors: OrderValidationErrors) {
	const { email, phone, address, payment } = errors;

	orderFormView.valid = !address && !payment;
	console.log(!address);
	contactFormView.valid = !email && !phone;

	orderFormView.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');

	contactFormView.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
}

function handleOrderFormSubmit(): void {
	const renderedContactForm: HTMLElement = contactFormView.render({
		email: orderService.getEmail(),
		phone: orderService.getPhone(),
		valid: false,
		errors: [],
	});

	modalView.render({ content: renderedContactForm });
}

function handleContactFormSubmit(): void {
	api.createOrder({
		payment: orderService.getPaymentMethod(),
		email: orderService.getEmail(),
		phone: orderService.getPhone(),
		address: orderService.getAddress(),
		total: orderService.getTotalCost(),
		items: orderService.getItems().map(i => i.id),
	}).then((result) => {

		modalView.render({
			content: successView.render({
				description: `Списано ${result.total} ${UI_TEXT.SYNAPSE_UNIT}`,
			}),
		});

		orderService.clearOrder();
	}).catch((err) => {
		console.error(err);
	});
}

function handleModalOpen() {
	pageView.toggleLockPage(true);
}

function handleModalClose() {
	pageView.toggleLockPage(false);
}

api.getProductList()
	.then(productData => productService.setProducts(productData))
	.catch(console.log);