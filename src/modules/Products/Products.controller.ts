import { Request, Response } from 'express';
import ProductsService from './Products.service.js';
import HTTPError from '../../shared/utils/HTTPError.js';
import z from 'zod';

export default class {
    constructor(private readonly service: ProductsService) {}

    getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (z.uuid().safeParse(id).success === false)
            throw new HTTPError('Invalid product ID', 400);

        const product = await this.service.getByIdOrThrow(id);
        if (!product) throw new HTTPError('Product not found', 404);
        return res.status(200).json(product);
    };

    getByCode = async (req: Request, res: Response) => {
        const { code } = req.params;
        if (
            z
                .string()
                .regex(/^[a-zA-Z0-9_-]+$/)
                .safeParse(code).success === false
        )
            throw new HTTPError(
                'Invalid product code, please use only alphanumeric characters',
                400
            );

        const product = await this.service.getByCodeOrThrow(code);
        if (!product) throw new HTTPError('Product not found', 404);
        return res.status(200).json(product);
    };

    getAll = async (req: Request, res: Response) => {
        const { search, cursor, take } = req.query;

        const products = await this.service.getAll(
            {
                search: typeof search === 'string' ? search : undefined,
                cursor:
                    typeof cursor === 'string' ? JSON.parse(cursor) : undefined,
                take: typeof take === 'string' ? parseInt(take) : undefined,
            },
            req.user?.Role == 'VENDEDOR'
        );

        return res.status(200).json(products);
    };

    create = async (req: Request, res: Response) => {
        const { Code, Name, Description, Price, Measure, IsActive } = req.body;
        if (
            !Code ||
            z
                .string()
                .regex(/^[a-zA-Z0-9_-]+$/)
                .safeParse(Code).success === false
        )
            throw new HTTPError(
                'Invalid or missing product code, please use only alphanumeric characters',
                400
            );
        if (!Name || typeof Name !== 'string' || Name.length < 3)
            throw new HTTPError(
                'Invalid or missing product name, it must be at least 3 characters long',
                400
            );
        if (
            !Description ||
            typeof Description !== 'string' ||
            Description.length < 10
        )
            throw new HTTPError(
                'Invalid or missing product description, it must be at least 10 characters long',
                400
            );
        if (Price === undefined || typeof Price !== 'number' || Price < 0)
            throw new HTTPError(
                'Invalid or missing product price, it must be a non-negative number',
                400
            );
        if (!Measure || !['KILO', 'LITRO', 'UNIDAD'].includes(Measure))
            throw new HTTPError(
                'Invalid or missing product measure, it must be one of KILO, LITRO, UNIDAD',
                400
            );
        if (IsActive === undefined || typeof IsActive !== 'boolean')
            throw new HTTPError(
                'Invalid or missing product active status, it must be a boolean',
                400
            );
        const product = await this.service.create(req.body);
        return res.status(201).json(product);
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (z.uuid().safeParse(id).success === false)
            throw new HTTPError('Invalid product ID', 400);

        const product = await this.service.updateOrThrow(id, req.body);
        return res.status(200).json(product);
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (z.uuid().safeParse(id).success === false)
            throw new HTTPError('Invalid product ID', 400);

        const product = await this.service.deleteOrThrow(id);
        return res.status(200).json(product);
    };
}
