import { prisma } from '../../lib/prisma.js';
import ProductCursor from '../../shared/types/Product/Product.cursor.type.js';
import ProductInput from '../../shared/types/Product/Product.input.type.js';

export default class {
    async create(data: ProductInput) {
        return await prisma.products.create({
            data: {
                Code: data.Code,
                Name: data.Name,
                Description: data.Description,
                Price: data.Price,
                Measure: data.Measure,
                IsActive: data.IsActive,
            },
        });
    }

    async findById(id: string) {
        return await prisma.products.findUnique({
            where: {
                ID: id,
                DeletedAt: null,
            },
            include: {
                Discount: true,
            },
        });
    }

    async findByCode(code: string) {
        return await prisma.products.findUnique({
            where: {
                Code: code,
                DeletedAt: null,
            },
            include: {
                Discount: true,
            },
        });
    }

    async findAll(
        searchParams: {
            search?: string;
            cursor?: ProductCursor;
            take?: number;
        },
        isFromSeller: boolean = false
    ) {
        const { search, cursor, take = 20 } = searchParams;

        const prods = await prisma.products.findMany({
            take: take + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor
                ? {
                      name_id: {
                          Name: cursor.Name,
                          ID: cursor.ID,
                      },
                  }
                : undefined,
            where: {
                DeletedAt: null,
                ...(isFromSeller && { IsActive: true }),
                ...(search && {
                    OR: [
                        { Code: { contains: search } },
                        { Name: { contains: search } },
                    ],
                }),
            },
            include: {
                Discount: true,
            },
            orderBy: [{ Name: 'asc' }, { ID: 'asc' }],
        });

        return prods;
    }

    async update(id: string, data: Omit<Partial<ProductInput>, 'Code'>) {
        return await prisma.products.update({
            where: {
                ID: id,
                DeletedAt: null,
            },
            data: {
                ...data,
            },
        });
    }

    async delete(id: string) {
        return await prisma.products.update({
            where: {
                ID: id,
                DeletedAt: null,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
