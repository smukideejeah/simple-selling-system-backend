import { Prisma } from '../../../prisma/generated/lib/client.js';
import { prisma } from '../../lib/prisma.js';
import OrderInput from '../../shared/types/Orders/Order.input.type.js';

export default class {
    async getById(OrderId: string) {
        return await prisma.orders.findUnique({
            where: {
                ID: OrderId,
            },
            include: {
                orderItems: true,
            },
        });
    }

    async getByUserId(
        UserId: string,
        searchParams?: { cursor?: string; take?: number }
    ) {
        const { cursor, take = 20 } = searchParams || {};

        return await prisma.orders.findMany({
            where: {
                UserID: UserId,
            },
            take: take + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { ID: cursor } : undefined,
            include: {
                orderItems: true,
            },
            orderBy: [{ CreatedAt: 'desc' }],
        });
    }

    async getAll(searchParams: { cursor?: string; take?: number }) {
        const { cursor, take = 20 } = searchParams;

        return await prisma.orders.findMany({
            take: take + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { ID: cursor } : undefined,
            include: {
                orderItems: true,
            },
            orderBy: [{ CreatedAt: 'desc' }],
        });
    }

    async create(data: OrderInput, tx: Prisma.TransactionClient) {
        return await tx.orders.create({
            data: {
                UserID: data.UserId,
                CustomerName: data.CustomerName,
                CustomerLastName: data.CustomerLastName,
                CustomerDNI: data.CustomerDNI,
                Total: data.Total,
                PaymentMethod: 'EFECTIVO',
                orderItems: {
                    create: data.Items.map((item) => ({
                        ProductID: item.ProductID,
                        UnitPrice: item.UnitPrice,
                        Qty: item.Qty,
                        TotalDiscount: item.TotalDiscount,
                        SubTotal: item.SubTotal,
                        TotalItem: item.TotalItem,
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });
    }

    async productsById(ProductsId: string[], tx: Prisma.TransactionClient) {
        return await tx.products.findMany({
            where: {
                ID: {
                    in: ProductsId,
                },
            },
            include: {
                Discount: true,
            },
        });
    }
}
