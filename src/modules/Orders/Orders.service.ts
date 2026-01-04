import { Prisma } from '../../../prisma/generated/lib/client.js';
import { prisma } from '../../lib/prisma.js';
import OrderInputInService from '../../shared/types/Orders/Order.inputInService.type.js';
import HTTPError from '../../shared/utils/HTTPError.js';
import OrdersCalculator from './Orders.calculator.js';
import { mapOrder, mapOrders } from './Orders.mapper.js';
import OrdersRepository from './Orders.repository.js';

export default class {
    constructor(private readonly Repository: OrdersRepository) {}

    async getOrderByIdOrThrow(OrderId: string) {
        const order = await this.Repository.getById(OrderId);
        if (!order) throw new HTTPError('Order not found', 404);
        return mapOrder({
            ...order,
            orderItems: order?.orderItems || [],
        });
    }

    async getOrderById(OrderId: string) {
        try {
            const order = await this.getOrderByIdOrThrow(OrderId);
            return order;
        } catch (err) {
            console.log('Error fetching order by ID:', err);
            return null;
        }
    }

    async getByUserIdOrThrow(
        UserId: string,
        searchParams?: { cursor?: string; take?: number }
    ) {
        try {
            const orders = await this.Repository.getByUserId(
                UserId,
                searchParams
            );
            const preMap = orders.map((order) => ({
                ...order,
                orderItems: order?.orderItems || [],
            }));

            return mapOrders(preMap, searchParams?.take || 20);
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code == 'P2025') {
                    console.log('User not found');
                    throw new HTTPError('User not found', 404);
                }
            }
            throw err;
        }
    }

    async getByUserId(
        UserId: string,
        searchParams?: { cursor?: string; take?: number }
    ) {
        try {
            const orders = await this.getByUserIdOrThrow(UserId, searchParams);
            return orders;
        } catch (err) {
            console.log('Error fetching orders by user ID:', err);
            return null;
        }
    }

    async getAll(searchParams: { cursor?: string; take?: number }) {
        const orders = await this.Repository.getAll(searchParams);
        const preMap = orders.map((order) => ({
            ...order,
            orderItems: order?.orderItems || [],
        }));
        return mapOrders(preMap, searchParams.take || 20);
    }

    async createOrThrow(data: OrderInputInService) {
        const maxRetries = 5;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const order = await prisma.$transaction(async (tx) => {
                    const productsId = data.Items.map((item) => item.ProductID);
                    const products = await this.Repository.productsById(
                        productsId,
                        tx
                    );
                    const productsFields = products.map((product) => ({
                        ID: product.ID,
                        Price: Number(product.Price),
                        Discount: product.Discount && {
                            IsActive: product.Discount.IsActive,
                            StartDate: product.Discount.StartDate,
                            EndDate: product.Discount.EndDate,
                            Value: Number(product.Discount.Value),
                        },
                    }));

                    const [{ now }] = await tx.$queryRaw<
                        { now: Date }[]
                    >`SELECT NOW() as now`;

                    const items = OrdersCalculator.calculateItems(
                        productsFields,
                        data.Items,
                        now
                    );
                    const totalOrder = OrdersCalculator.calculateTotal(items);

                    const createdOrder = await this.Repository.create(
                        {
                            UserId: data.UserId,
                            CustomerName: data.CustomerName,
                            CustomerLastName: data.CustomerLastName,
                            CustomerDNI: data.CustomerDNI,
                            Total: totalOrder,
                            Items: items,
                        },
                        tx
                    );

                    return createdOrder;
                });

                return mapOrder({
                    ...order,
                    orderItems: order?.orderItems || [],
                });
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code == 'P2034'
                ) {
                    attempt++;

                    if (attempt == maxRetries) {
                        console.log(
                            'Max retries reached. Could not create order due to serialization failure.'
                        );
                        throw new HTTPError(
                            'Could not create order due to high concurrency. Please try again later.',
                            409
                        );
                    }
                    await new Promise((res) => setTimeout(res, attempt * 100));
                    continue;
                }
                throw error;
            }
        }
    }

    async create(data: OrderInputInService) {
        try {
            return await this.createOrThrow(data);
        } catch (err) {
            console.log('Error creating order:', (err as Error).message);
            return null;
        }
    }
}
