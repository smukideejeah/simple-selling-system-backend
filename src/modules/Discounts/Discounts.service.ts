import { Prisma } from '../../../prisma/generated/lib/client.js';
import DiscountInput from '../../shared/types/Discount/Discount.input.type.js';
import HTTPError from '../../shared/utils/HTTPError.js';
import { mapDiscount, mapDiscounts } from './Discounts.mapper.js';
import DiscountsRepository from './Discounts.repository.js';

export default class {
    constructor(private readonly Repository: DiscountsRepository) {}

    async getById(DiscountId: string) {
        const discount = await this.Repository.findById(DiscountId);
        if (!discount) return null;
        return mapDiscount({
            ...discount,
            Product: discount.product,
        });
    }

    async getByIdOrThrow(DiscountId: string) {
        const discount = await this.Repository.findById(DiscountId);
        if (!discount) throw new HTTPError('Discount not found', 404);
        return mapDiscount({
            ...discount,
            Product: discount.product,
        });
    }

    async getAll(searchParams: {
        search?: string;
        cursor?: string;
        take?: number;
    }) {
        const discounts = await this.Repository.findAll(searchParams);
        const preMapDiscounts = discounts.map((discount) => ({
            ...discount,
            Product: discount.product,
        }));
        return mapDiscounts(preMapDiscounts, searchParams.take || 20);
    }

    async create(data: DiscountInput) {
        const product = await this.Repository.findProductById(data.ProductID);

        if (product) return null;
        if (data.Percentage <= 0 || data.Percentage > 100) return null;
        if (new Date(data.ValidFrom) >= new Date(data.ValidTo)) return null;

        const discount = await this.Repository.create(data);
        return mapDiscount({
            ...discount,
            Product: discount.product,
        });
    }

    async createOrThrow(data: DiscountInput) {
        const product = await this.Repository.findProductById(data.ProductID);

        if (!product) throw new HTTPError('Product not found', 404);
        if (product.Discount)
            throw new HTTPError('Product already has a discount', 400);
        if (data.Percentage <= 0 || data.Percentage > 100)
            throw new HTTPError('Invalid Percentage value', 400);
        if (new Date(data.ValidFrom) >= new Date(data.ValidTo))
            throw new HTTPError('Invalid date range', 400);

        const discount = await this.Repository.create(data);
        return mapDiscount({
            ...discount,
            Product: discount.product,
        });
    }

    async update(DiscountId: string, data: Partial<DiscountInput>) {
        try {
            const discount = await this.Repository.update(DiscountId, data);
            return mapDiscount({
                ...discount,
                Product: discount.product,
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code == 'P2025') {
                    console.log('Discount not found');
                    return null;
                }
            }
            throw err;
        }
    }

    async updateOrThrow(DiscountId: string, data: Partial<DiscountInput>) {
        try {
            const discount = await this.Repository.update(DiscountId, data);
            return mapDiscount({
                ...discount,
                Product: discount.product,
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError)
                if (err.code == 'P2025')
                    throw new HTTPError('Discount not found', 404);
            throw err;
        }
    }

    async delete(DiscountId: string) {
        try {
            await this.Repository.delete(DiscountId);
            return true;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code == 'P2025') {
                    console.log('Discount not found');
                    return false;
                }
            }
            throw err;
        }
    }

    async deleteOrThrow(DiscountId: string) {
        try {
            await this.Repository.delete(DiscountId);
            return true;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError)
                if (err.code == 'P2025')
                    throw new HTTPError('Discount not found', 404);
            throw err;
        }
    }
}
