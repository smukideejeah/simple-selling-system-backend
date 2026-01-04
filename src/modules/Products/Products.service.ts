import { Prisma } from '../../../prisma/generated/lib/client.js';
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

    async updateOrThrow(id: string, data: Omit<Partial<ProductInput>, 'Code'>) {
        try {
            const product = await this.repository.update(id, data);
            return mapProduct(product);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError)
                if (err.code == 'P2025')
                    throw new HTTPError('Product not found', 404);

            throw err;
        }
    }

    async update(id: string, data: Omit<Partial<ProductInput>, 'Code'>) {
        try {
            const product = await this.updateOrThrow(id, data);
            return product;
        } catch (err) {
            console.log('Error updating product:', (err as Error).message);
            return null;
        }
    }

    async deleteOrThrow(id: string) {
        try {
            const product = await this.repository.delete(id);
            return mapProduct(product);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError)
                if (err.code == 'P2025')
                    throw new HTTPError('Product not found', 404);

            throw err;
        }
    }

    async delete(id: string) {
        try {
            const product = await this.deleteOrThrow(id);
            return product;
        } catch (err) {
            console.log('Error deleting product:', (err as Error).message);
            return null;
        }
    }
}
