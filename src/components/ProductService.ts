import { Model } from './base/Model';
import { IProduct } from '../types';

interface IProductService {
	products: IProduct[];
	selectedProduct: IProduct;
}

export class ProductService extends Model<IProductService> {
	private products: IProduct[];
	private selectedProduct: IProduct | null;

	getProducts(): IProduct[] {
		return this.products;
	}

	setProducts(value: IProduct[]) {
		this.products = value;
		this.emitChanges('products:changed', { products: this.products });
	}

	setSelectedProduct(value: IProduct | null) {
		this.selectedProduct = value;
		this.emitChanges('product:selected', value);
	}
}