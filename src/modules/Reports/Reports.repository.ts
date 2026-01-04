import { prisma } from '../../lib/prisma.js';

export default class {
    async getTop10Products() {
        const topProducts = await prisma.orderItems.groupBy({
            by: ['ProductID'],
            _sum: {
                TotalItem: true,
            },
            orderBy: {
                _sum: {
                    TotalItem: 'desc',
                },
            },
            take: 10,
        });
        return topProducts;
    }

    async getProductsById(productIds: string[]) {
        const products = await prisma.products.findMany({
            where: {
                ID: {
                    in: productIds,
                },
            },
        });
        return products;
    }
}
