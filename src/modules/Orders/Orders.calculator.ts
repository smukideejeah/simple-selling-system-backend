import HTTPError from '../../shared/utils/HTTPError.js';

type ProductsToCalculate = {
    ID: string;
    Price: number;
    Discount?: {
        IsActive: boolean;
        StartDate: Date;
        EndDate: Date;
        Value: number;
    } | null;
};

type ItemToCalculate = {
    ProductID: string;
    Qty: number;
};

function calculateItems(
    products: ProductsToCalculate[],
    items: ItemToCalculate[],
    now: Date
) {
    const productsMap = new Map(products.map((p) => [p.ID, p]));
    return items.map((item) => {
        const product = productsMap.get(item.ProductID);
        if (!product)
            throw new HTTPError(
                `Product with ID ${item.ProductID} not found`,
                404
            );

        const SubTotal = Number(product.Price) * item.Qty;

        let TotalDiscount = 0;
        if (!!product.Discount && product.Discount.IsActive) {
            if (
                now >= product.Discount.StartDate &&
                now <= product.Discount.EndDate
            )
                TotalDiscount =
                    SubTotal * (Number(product.Discount.Value) / 100);
        }

        const TotalItem = SubTotal - TotalDiscount;

        return {
            ProductID: item.ProductID,
            UnitPrice: Number(product.Price),
            Qty: item.Qty,
            SubTotal,
            TotalDiscount,
            TotalItem,
        };
    });
}

function calculateTotal(items: ReturnType<typeof calculateItems>) {
    return items.reduce((acc, item) => acc + item.TotalItem, 0);
}

export default {
    calculateItems,
    calculateTotal,
};
