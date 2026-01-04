import { Request, Response } from 'express';
import DiscountsService from './Discounts.service.js';
import DiscountInput from '../../shared/types/Discount/Discount.input.type.js';
import z from 'zod';
import HTTPError from '../../shared/utils/HTTPError.js';

export default class {
    constructor(private readonly Service: DiscountsService) {}

    getById = async (Req: Request, Res: Response) => {
        const { DiscountId } = Req.params;
        const discount = await this.Service.getByIdOrThrow(DiscountId);
        return Res.status(200).json(discount);
    };

    getAll = async (Req: Request, Res: Response) => {
        const { search, cursor, take } = Req.query;
        const discounts = await this.Service.getAll({
            search: search as string,
            cursor: cursor as string,
            take: take ? Number(take) : undefined,
        });
        return Res.status(200).json(discounts);
    };

    create = async (Req: Request, Res: Response) => {
        const data: DiscountInput = Req.body;

        if (
            !data.ProductID ||
            z.uuid().safeParse(data.ProductID).success === false
        )
            throw new HTTPError('Invalid or missing ProductID', 400);
        if (
            typeof data.Percentage !== 'number' ||
            data.Percentage <= 0 ||
            data.Percentage > 100
        )
            throw new HTTPError('Invalid or missing Percentage', 400);
        if (!data.ValidFrom || isNaN(new Date(data.ValidFrom).getTime()))
            throw new HTTPError('Invalid or missing ValidFrom date', 400);
        if (!data.ValidTo || isNaN(new Date(data.ValidTo).getTime()))
            throw new HTTPError('Invalid or missing ValidTo date', 400);
        if (typeof data.isActive !== 'boolean')
            throw new HTTPError('Invalid or missing isActive flag', 400);

        const discount = await this.Service.createOrThrow(data);
        return Res.status(201).json(discount);
    };

    update = async (Req: Request, Res: Response) => {
        const { DiscountId } = Req.params;
        const data: Partial<DiscountInput> = Req.body;

        if (
            data.ProductID &&
            z.uuid().safeParse(data.ProductID).success === false
        )
            throw new HTTPError('Invalid ProductID', 400);
        if (
            data.Percentage !== undefined &&
            (typeof data.Percentage !== 'number' ||
                data.Percentage <= 0 ||
                data.Percentage > 100)
        )
            throw new HTTPError('Invalid Percentage', 400);
        if (data.ValidFrom && isNaN(new Date(data.ValidFrom).getTime()))
            throw new HTTPError('Invalid ValidFrom date', 400);
        if (data.ValidTo && isNaN(new Date(data.ValidTo).getTime()))
            throw new HTTPError('Invalid ValidTo date', 400);
        if (data.isActive !== undefined && typeof data.isActive !== 'boolean')
            throw new HTTPError('Invalid isActive flag', 400);

        const discount = await this.Service.updateOrThrow(DiscountId, data);
        return Res.status(200).json(discount);
    };

    delete = async (Req: Request, Res: Response) => {
        const { DiscountId } = Req.params;
        await this.Service.deleteOrThrow(DiscountId);
        return Res.status(204).send();
    };
}
