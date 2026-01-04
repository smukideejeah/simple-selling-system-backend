import { Request, Response } from 'express';
import z from 'zod';
import HTTPError from '../../shared/utils/HTTPError.js';
import OrdersService from './Orders.service.js';

export default class {
    constructor(private Service: OrdersService) {}

    getById = async (Req: Request, Res: Response) => {
        const { id } = Req.params;
        if (z.uuid().safeParse(id).success === false)
            throw new HTTPError('Invalid ID format', 400);
        const order = await this.Service.getOrderByIdOrThrow(id);
        return Res.json(order);
    };

    getByUserId = async (Req: Request, Res: Response) => {
        const { userId } = Req.params;
        const { cursor, take = 20 } = Req.query;
        if (z.uuid().safeParse(userId).success === false)
            throw new HTTPError('Invalid User ID format', 400);
        if (cursor && z.uuid().safeParse(cursor).success === false)
            throw new HTTPError('Invalid cursor format', 400);
        if (!Number.isInteger(Number(take)) || Number(take) <= 0)
            throw new HTTPError('Invalid take value', 400);

        const orders = await this.Service.getByUserIdOrThrow(userId, {
            cursor: cursor as string | undefined,
            take: take ? Number(take) : undefined,
        });

        return Res.json(orders);
    };

    getAll = async (Req: Request, Res: Response) => {
        const { cursor, take = 20 } = Req.query;
        if (cursor && z.uuid().safeParse(cursor).success === false)
            throw new HTTPError('Invalid cursor format', 400);
        if (!Number.isInteger(Number(take)) || Number(take) <= 0)
            throw new HTTPError('Invalid take value', 400);

        const orders = await this.Service.getAll({
            cursor: cursor as string | undefined,
            take: take ? Number(take) : undefined,
        });

        return Res.json(orders);
    };

    create = async (Req: Request, Res: Response) => {
        const { UserId, CustomerName, CustomerLastName, CustomerDNI, Items } =
            Req.body;

        if (!UserId || z.uuid().safeParse(UserId).success === false)
            throw new HTTPError('Invalid or missing UserId', 400);
        if (!CustomerName || typeof CustomerName !== 'string')
            throw new HTTPError('Invalid or missing CustomerName', 400);
        if (!CustomerLastName || typeof CustomerLastName !== 'string')
            throw new HTTPError('Invalid or missing CustomerLastName', 400);
        if (!CustomerDNI || typeof CustomerDNI !== 'string')
            throw new HTTPError('Invalid or missing CustomerDNI', 400);
        if (!Array.isArray(Items) || Items.length === 0)
            throw new HTTPError('Items must be a non-empty array', 400);

        for (const item of Items) {
            if (
                !item.ProductID ||
                z.uuid().safeParse(item.ProductID).success === false
            )
                throw new HTTPError(
                    'Invalid or missing ProductID in one of the items',
                    400
                );
            if (
                typeof item.Qty !== 'number' ||
                !Number.isInteger(item.Qty) ||
                item.Qty <= 0
            )
                throw new HTTPError(
                    'Invalid or missing Quantity in one of the items',
                    400
                );
        }

        const createdOrder = await this.Service.createOrThrow({
            UserId,
            CustomerName,
            CustomerLastName,
            CustomerDNI,
            Items,
        });
        return Res.status(201).json(createdOrder);
    };
}
