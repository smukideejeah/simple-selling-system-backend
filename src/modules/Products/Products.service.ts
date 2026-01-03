import ProductCursor from '../../shared/types/Product/Product.cursor.type.js';
import ProductInput from '../../shared/types/Product/Product.input.type.js';
import HTTPError from '../../shared/utils/HTTPError.js';
import { mapProduct, mapProducts } from './Products.mapper.js';
import ProductsRepository from './Products.repository.js';

export default class {
    constructor(private readonly repository: ProductsRepository) {}

    async getById(id: string) {
        const product = await this.repository.findById(id);
        return mapProduct(product);
    }

    async getByIdOrThrow(id: string) {
        const product = await this.repository.findById(id);
        if (!product) throw new HTTPError('Product not found', 404);
        return mapProduct(product);
    }

    async getByCode(code: string) {
        const product = await this.repository.findByCode(code);
        return mapProduct(product);
    }

    async getByCodeOrThrow(code: string) {
        const product = await this.repository.findByCode(code);
        if (!product) throw new HTTPError('Product not found', 404);
        return mapProduct(product);
    }

    async getAll(
        searchParams: {
            search?: string;
            cursor?: ProductCursor;
            take?: number;
        },
        isFromSeller: boolean = false
    ) {
        const products = await this.repository.findAll(
            searchParams,
            isFromSeller
        );
        return mapProducts(products, searchParams.take || 20);
    }

    async create(data: ProductInput) {
        const product = await this.repository.create(data);
        return mapProduct(product);
    }

    async update(id: string, data: Omit<Partial<ProductInput>, 'Code'>) {
        const product = await this.repository.update(id, data);
        return mapProduct(product);
    }

    async delete(id: string) {
        const product = await this.repository.delete(id);
        return mapProduct(product);
    }
}
