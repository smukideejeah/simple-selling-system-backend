import { prisma } from '../../lib/prisma.js';
import DiscountInput from '../../shared/types/Discount/Discount.input.type.js';

export default class {
    async findById(DiscountId: string) {
        return await prisma.discounts.findUnique({
            where: {
                ID: DiscountId,
            },
            include: {
                product: true,
            },
        });
    }

    async findProductById(ProductID: string) {
        return await prisma.products.findUnique({
            where: {
                ID: ProductID,
            },
            include: {
                Discount: true,
            },
        });
    }

    async findAll(searchParams: { cursor?: string; take?: number }) {
        const { cursor, take = 20 } = searchParams;

        const discounts = await prisma.discounts.findMany({
            take: take + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { ID: cursor } : undefined,
            include: {
                product: true,
            },
            orderBy: [{ CreatedAt: 'desc' }],
        });

        return discounts;
    }

    async create(data: DiscountInput) {
        const product = await prisma.discounts.create({
            data: {
                ProductID: data.ProductID,
                Type: 'PORCENTAJE',
                Value: data.Percentage,
                StartDate: data.ValidFrom,
                EndDate: data.ValidTo,
                IsActive: data.isActive,
            },
            include: {
                product: true,
            },
        });
        return product;
    }

    async update(DiscountId: string, data: Partial<DiscountInput>) {
        return await prisma.discounts.update({
            where: {
                ID: DiscountId,
            },
            data: {
                ProductID: data.ProductID,
                Value: data.Percentage,
                StartDate: data.ValidFrom,
                EndDate: data.ValidTo,
                IsActive: data.isActive,
            },
            include: {
                product: true,
            },
        });
    }

    async delete(DiscountId: string) {
        return await prisma.discounts.delete({
            where: {
                ID: DiscountId,
            },
        });
    }
}
