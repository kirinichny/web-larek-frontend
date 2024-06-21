import { Api, ApiListResponse } from './base/Api';
import { IOrder, IProduct } from '../types';

interface IOrderResponse {
	id: string;
	total: number;
	error?: string;
}

export interface IWebLarekApi {
	getProductList(): Promise<IProduct[]>;

	createOrder(orderData: IOrder): Promise<IOrderResponse>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
	readonly cdnUrl: string;

	constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdnUrl = cdnUrl;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdnUrl + item.image,
			})),
		);
	}

	createOrder(orderData: IOrder): Promise<IOrderResponse> {
		return this.post('/order', orderData).then(
			(data: IOrderResponse) => data,
		);
	}
}