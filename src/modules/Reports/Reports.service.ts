import ReportsRepository from './Reports.repository.js';

export default class {
    constructor(private readonly repository: ReportsRepository) {}

    async Top10ProductsReport() {
        const reportData = await this.repository.getTop10Products();
        const productIds = reportData.map((item) => item.ProductID);
        const products = await this.repository.getProductsById(productIds);

        const report = reportData.map((item) => {
            const product = products.find((p) => p.ID === item.ProductID);
            return {
                productId: item.ProductID,
                productName: product ? product.Name : 'Unknown Product',
                total: Number(item._sum.TotalItem) || 0,
            };
        });

        return report;
    }
}
